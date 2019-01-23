import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueuedTrack } from '../../../../shared/modules/db/entities/queued-track.model';
import { User } from '../../../../shared/modules/db/entities/user.model';
import { Vote } from '../../../../shared/modules/db/entities/vote.model';
import { QueuedTrackRepository } from '../../../../shared/modules/db/repositories/queued-track.repository';
import { TrackRepository } from '../../../../shared/modules/db/repositories/track.repository';
import { UserRepository } from '../../../../shared/modules/db/repositories/user.repository';
import { VoteRepository } from '../../../../shared/modules/db/repositories/vote.repository';
import { SlackService } from '../../../../shared/services/slack.service';
import { Command } from '../interfaces/command.iterface';

@Injectable()
export class ThumbUpCommand implements Command {
    description = ' the song will be played more often';
    type = ':+1:';

    constructor(@InjectRepository(QueuedTrackRepository) private queuedTrackRepository: QueuedTrackRepository,
                private slack: SlackService,
                @InjectRepository(UserRepository) private userRepository: UserRepository,
                @InjectRepository(TrackRepository) private trackRepository: TrackRepository,
                @InjectRepository(VoteRepository) private voteRepository: VoteRepository) {
    }

    async handler(command: string[], message: any): Promise<any> {
        const userId = message.user;
        const user = await this.userRepository.findOne(userId);
        const currentTrackInQueue = <QueuedTrack>await this.queuedTrackRepository.getCurrentTrack();

        const thumbUpFromUser = await this.voteRepository.countPositiveVotesFromUserToQueuedTrack(currentTrackInQueue.id, userId);

        if (thumbUpFromUser > 0) {
            return;
        }

        const thumbUp = new Vote(<User>user, currentTrackInQueue, 1);
        thumbUp.addedAt = new Date();
        this.voteRepository.save(thumbUp)
            .then(() => {
                this.slack.rtm.sendMessage('Super! (' + currentTrackInQueue.track.title + ') będzie grana częściej', message.channel);
            });
    };

}