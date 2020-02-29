import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { User, Vote } from '@sdj/backend/radio/core/domain';
import {
  QueuedTrackDomainRepository,
  UserDomainRepository,
  VoteDomainRepository
} from '@sdj/backend/radio/core/domain-service';
import { ThumbDownCommand } from './thumb-down.command';

@CommandHandler(ThumbDownCommand)
export class ThumbDownHandler implements ICommandHandler<ThumbDownCommand> {
  constructor(
    private queuedTrackRepository: QueuedTrackDomainRepository,
    private userRepository: UserDomainRepository,
    private voteRepository: VoteDomainRepository
  ) {}

  async execute(command: ThumbDownCommand): Promise<unknown> {
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
    return this.voteRepository.save(unlike);
  }
}
