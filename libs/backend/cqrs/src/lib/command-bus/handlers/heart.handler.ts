import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { HeartCommand } from '@sdj/backend/core';
import { QueuedTrackRepository, User, UserRepository, Vote, VoteRepository } from '@sdj/backend/db';

@CommandHandler(HeartCommand)
export class HeartHandler implements ICommandHandler<HeartCommand> {
  constructor(
    @InjectRepository(QueuedTrackRepository)
    private queuedTrackRepository: QueuedTrackRepository,
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    @InjectRepository(VoteRepository) private voteRepository: VoteRepository
  ) {}

  async execute(command: HeartCommand): Promise<void> {
    const userId = command.userId;
    const user = await this.userRepository.findOne(userId);
    const queuedTrack = await this.queuedTrackRepository.findOneOrFail(
      command.queuedTrackId
    );
    const heartsFromUser = await this.voteRepository.countTodayHeartsFromUser(
      userId,
      queuedTrack.playedIn.id
    );

    if (heartsFromUser > 0) {
      throw Error('To much hearts');
    }

    const thumbUp = new Vote(<User>user, queuedTrack, 3);
    thumbUp.createdAt = new Date();
    await this.voteRepository.save(thumbUp);
  }
}
