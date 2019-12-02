import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { ThumbUpCommand } from '@sdj/backend/core';
import {
  QueuedTrackRepository,
  User,
  UserRepository,
  Vote,
  VoteRepository
} from '@sdj/backend/db';

@CommandHandler(ThumbUpCommand)
export class ThumbUpHandler implements ICommandHandler<ThumbUpCommand> {
  constructor(
    @InjectRepository(QueuedTrackRepository)
    private queuedTrackRepository: QueuedTrackRepository,
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    @InjectRepository(VoteRepository) private voteRepository: VoteRepository
  ) {}

  async execute(command: ThumbUpCommand): Promise<void> {
    const userId = command.userId;
    const user = await this.userRepository.findOne(userId);
    const queuedTrack = await this.queuedTrackRepository.findOneOrFail(
      command.queuedTrackId
    );

    const thumbUpFromUser = await this.voteRepository.countPositiveVotesFromUserToQueuedTrack(
      queuedTrack.id,
      userId
    );

    if (thumbUpFromUser > 0) {
      throw Error('To much thumbs');
    }

    const thumbUp = new Vote(<User>user, queuedTrack, 1);
    thumbUp.createdAt = new Date();
    await this.voteRepository.save(thumbUp);
    return;
  }
}
