import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { QueuedTrackRepository } from '../../../../core/modules/db/repositories/queued-track.repository';
import { UserRepository } from '../../../../core/modules/db/repositories/user.repository';
import { VoteRepository } from '../../../../core/modules/db/repositories/vote.repository';
import { User } from '../../../modules/db/entities/user.entity';
import { Vote } from '../../../modules/db/entities/vote.entity';
import { HeartCommand } from '../commands/heart.command';

@CommandHandler(HeartCommand)
export class HeartHandler implements ICommandHandler<HeartCommand> {

    constructor(@InjectRepository(QueuedTrackRepository) private queuedTrackRepository: QueuedTrackRepository,
                @InjectRepository(UserRepository) private userRepository: UserRepository,
                @InjectRepository(VoteRepository) private voteRepository: VoteRepository) {
    }

    async execute(command: HeartCommand, resolve: (value?) => void) {
        const userId = command.userId;
        const user = await this.userRepository.findOne(userId);
        const queuedTrack = await this.queuedTrackRepository.findOneOrFail(command.queuedTrackId);
        const heartsFromUser = await this.voteRepository.countTodayHeartsFromUser(userId);

        if (heartsFromUser > 0) {
            resolve(false);
            return;
        }

        const thumbUp = new Vote(<User>user, queuedTrack, 3);
        thumbUp.createdAt = new Date();
        this.voteRepository.save(thumbUp)
            .then(() => {
                resolve(true);
            });
    }

}
