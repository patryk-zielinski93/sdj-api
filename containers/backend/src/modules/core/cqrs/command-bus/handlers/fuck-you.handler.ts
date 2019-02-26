import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../../core/modules/db/entities/user.model';
import { Vote } from '../../../../core/modules/db/entities/vote.model';
import { QueuedTrackRepository } from '../../../../core/modules/db/repositories/queued-track.repository';
import { UserRepository } from '../../../../core/modules/db/repositories/user.repository';
import { VoteRepository } from '../../../../core/modules/db/repositories/vote.repository';
import { FuckYouCommand } from '../commands/fuck-you.command';
import { HeartCommand } from '../commands/heart.command';

@CommandHandler(FuckYouCommand)
export class FuckYouHandler implements ICommandHandler<FuckYouCommand> {

    constructor(@InjectRepository(QueuedTrackRepository) private queuedTrackRepository: QueuedTrackRepository,
                @InjectRepository(UserRepository) private userRepository: UserRepository,
                @InjectRepository(VoteRepository) private voteRepository: VoteRepository) {
    }

    async execute(command: HeartCommand, resolve: (value?) => void) {
        const userId = command.userId;
        const user = await this.userRepository.findOne(userId);
        const queuedTrack = await this.queuedTrackRepository.findOneOrFail(command.queuedTrackId);
        const fucksFromUser = await this.voteRepository.countTodayFucksFromUser(userId);

        if (fucksFromUser > 0) {
            resolve(false);
            return;
        }

        const thumbUp = new Vote(<User>user, queuedTrack, -3);
        thumbUp.createdAt = new Date();
        this.voteRepository.save(thumbUp)
            .then(() => {
                resolve(true);
            });
    }

}
