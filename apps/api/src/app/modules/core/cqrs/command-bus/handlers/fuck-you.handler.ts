import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { QueuedTrackRepository } from '../../../../core/modules/db/repositories/queued-track.repository';
import { UserRepository } from '../../../../core/modules/db/repositories/user.repository';
import { VoteRepository } from '../../../../core/modules/db/repositories/vote.repository';
import { FuckYouCommand } from '../commands/fuck-you.command';
import { HeartCommand } from '../commands/heart.command';
import { Vote } from '../../../modules/db/entities/vote.entity';
import { User } from '../../../modules/db/entities/user.entity';

@CommandHandler(FuckYouCommand)
export class FuckYouHandler implements ICommandHandler<FuckYouCommand> {
  constructor(
    @InjectRepository(QueuedTrackRepository)
    private queuedTrackRepository: QueuedTrackRepository,
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    @InjectRepository(VoteRepository) private voteRepository: VoteRepository
  ) {}

  async execute(command: HeartCommand) {
    const userId = command.userId;
    const user = await this.userRepository.findOne(userId);
    const queuedTrack = await this.queuedTrackRepository.findOneOrFail(
      command.queuedTrackId
    );
    const fucksFromUser = await this.voteRepository.countTodayFucksFromUser(
      userId,
      queuedTrack.playedIn.id
    );

    if (fucksFromUser > 0) {
      return;
    }

    const thumbUp = new Vote(<User>user, queuedTrack, -3);
    thumbUp.createdAt = new Date();
    return this.voteRepository.save(thumbUp);
  }
}
