import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { appConfig } from '../../../../../configs/app.config';
import { QueuedTrack } from '../../../../shared/modules/db/entities/queued-track.model';
import { User } from '../../../../shared/modules/db/entities/user.model';
import { Vote } from '../../../../shared/modules/db/entities/vote.model';
import { QueuedTrackRepository } from '../../../../shared/modules/db/repositories/queued-track.repository';
import { TrackRepository } from '../../../../shared/modules/db/repositories/track.repository';
import { UserRepository } from '../../../../shared/modules/db/repositories/user.repository';
import { VoteRepository } from '../../../../shared/modules/db/repositories/vote.repository';
import { IcesService } from '../../../../shared/services/ices.service';
import { SlackService } from '../../../../shared/services/slack.service';
import { Command } from '../interfaces/command.iterface';

@Injectable()
export class VoteForNextSongCommand implements Command {
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
        const currentTrackInQueue = <QueuedTrack>await this.queuedTrackRepository.getCurrentTrack();

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
        unlike.addedAt = new Date();
        this.voteRepository.save(unlike);
    };

}