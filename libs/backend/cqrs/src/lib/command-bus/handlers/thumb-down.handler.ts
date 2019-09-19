import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import {
  QueuedTrackRepository,
  User,
  UserRepository,
  Vote,
  VoteRepository
} from '@sdj/backend/db';
import { ThumbDownCommand } from '../../../../../core/src/lib/cqrs/commands/thumb-down.command';
import { appConfig } from '@sdj/backend/config';
import { HostService } from '@sdj/backend/core';

@CommandHandler(ThumbDownCommand)
export class ThumbDownHandler implements ICommandHandler<ThumbDownCommand> {
  constructor(
    @InjectRepository(QueuedTrackRepository)
    private queuedTrackRepository: QueuedTrackRepository,
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    @InjectRepository(VoteRepository) private voteRepository: VoteRepository
  ) {}

  async execute(command: ThumbDownCommand): Promise<void> {
    const { queuedTrackId, userId } = command;
    const user = await this.userRepository.findOne(userId);
    const queuedTrack = await this.queuedTrackRepository.findOneOrFail(
      queuedTrackId
    );
    const channelId = queuedTrack.playedIn.id;

    const unlikesCountFromUser = await this.voteRepository.countUnlikesFromUserToQueuedTrack(
      queuedTrackId,
      userId,
      channelId
    );

    if (unlikesCountFromUser > 0) {
      return;
    }

    // ToDo move to command
    const unlike = new Vote(<User>user, queuedTrack, -1);
    unlike.createdAt = new Date();
    this.voteRepository.save(unlike);
  }
}
