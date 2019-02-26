import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { appConfig } from '../../../../../configs/app.config';
import { User } from '../../../../core/modules/db/entities/user.model';
import { Vote } from '../../../../core/modules/db/entities/vote.model';
import { QueuedTrackRepository } from '../../../../core/modules/db/repositories/queued-track.repository';
import { TrackRepository } from '../../../../core/modules/db/repositories/track.repository';
import { UserRepository } from '../../../../core/modules/db/repositories/user.repository';
import { VoteRepository } from '../../../../core/modules/db/repositories/vote.repository';
import { IcesService } from '../../../../core/services/ices.service';
import { SlackService } from '../../../services/slack.service';
import { SlackCommand } from '../interfaces/slack-command';

@Injectable()
export class ThumbDownSlackCommand implements SlackCommand {
    description = 'Vote to skip that song';
    type = ':-1:';

    constructor(@InjectRepository(QueuedTrackRepository) private queuedTrackRepository: QueuedTrackRepository,
                private slackService: SlackService,
                @InjectRepository(UserRepository) private userRepository: UserRepository,
                @InjectRepository(TrackRepository) private trackRepository: TrackRepository,
                @InjectRepository(VoteRepository) private voteRepository: VoteRepository) {
    }

    async handler(command: string[], message: any): Promise<any> {
        const userId = message.user;
        const user = await this.userRepository.findOne(userId);
        const currentTrackInQueue = await this.queuedTrackRepository.getCurrentTrack();
        if (!currentTrackInQueue) {
            return;
        }

        const unlikesCountFromUser = await this.voteRepository.countUnlikesFromUserToQueuedTrack(currentTrackInQueue.id, userId);

        if (unlikesCountFromUser > 0) {
            return;
        }

        const unlikesCount = await this.voteRepository.countUnlinksForQueuedTrack(currentTrackInQueue.id);

        if (unlikesCount + 1 >= appConfig.nextSongVoteQuantity) {
            this.slackService.rtm.sendMessage('Skipping ' + currentTrackInQueue.track.title + '\n'
                + (currentTrackInQueue.track.skips + 1) + ' times skipped', message.channel);
            IcesService.nextSong();
            currentTrackInQueue.track.skips++;
            this.trackRepository.save(currentTrackInQueue.track);
        } else {
            this.slackService.rtm.sendMessage('Left ' + (appConfig.nextSongVoteQuantity - (unlikesCount + 1)) + ' before skip', message.channel);
        }

        const unlike = new Vote(<User>user, currentTrackInQueue, -1);
        unlike.createdAt = new Date();
        this.voteRepository.save(unlike);
    };

}