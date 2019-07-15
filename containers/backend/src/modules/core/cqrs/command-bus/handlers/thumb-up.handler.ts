import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { QueuedTrackRepository } from '../../../../core/modules/db/repositories/queued-track.repository';
import { TrackRepository } from '../../../../core/modules/db/repositories/track.repository';
import { UserRepository } from '../../../../core/modules/db/repositories/user.repository';
import { VoteRepository } from '../../../../core/modules/db/repositories/vote.repository';
import { User } from '../../../modules/db/entities/user.entity';
import { Vote } from '../../../modules/db/entities/vote.entity';
import { ThumbUpCommand } from '../commands/thumb-up.command';

@CommandHandler(ThumbUpCommand)
export class ThumbUpHandler implements ICommandHandler<ThumbUpCommand> {

    constructor(@InjectRepository(QueuedTrackRepository) private queuedTrackRepository: QueuedTrackRepository,
                @InjectRepository(UserRepository) private userRepository: UserRepository,
                @InjectRepository(TrackRepository) private trackRepository: TrackRepository,
                @InjectRepository(VoteRepository) private voteRepository: VoteRepository) {
    }

    async execute(command: ThumbUpCommand, resolve: (value?) => void) {
        const userId = command.userId;
        const user = await this.userRepository.findOne(userId);
        const queuedTrack = await this.queuedTrackRepository.findOneOrFail(command.queuedTrackId);

        const thumbUpFromUser = await this.voteRepository.countPositiveVotesFromUserToQueuedTrack(queuedTrack.id, userId);

        if (thumbUpFromUser > 0) {
            return;
        }

        const thumbUp = new Vote(<User>user, queuedTrack, 1);
        thumbUp.createdAt = new Date();
        this.voteRepository.save(thumbUp)
            .then(() => {
                resolve();
            });
    }

}
