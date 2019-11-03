import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { QueuedTrackRepository, User, UserRepository, Vote, VoteRepository } from "@sdj/backend/db";
import { FuckYouCommand } from "../../../../../core/src/lib/cqrs/commands/fuck-you.command";
import { HeartCommand } from "../../../../../core/src/lib/cqrs/commands/heart.command";

@CommandHandler(FuckYouCommand)
export class FuckYouHandler implements ICommandHandler<FuckYouCommand> {
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
    const fucksFromUser = await this.voteRepository.countTodayFucksFromUser(
      userId,
      queuedTrack.playedIn.id
    );

    if (fucksFromUser > 0) {
      throw Error('To much Fucks');
    }

    const thumbUp = new Vote(<User>user, queuedTrack, -3);
    thumbUp.createdAt = new Date();
    await this.voteRepository.save(thumbUp);
  }
}
