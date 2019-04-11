import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { appConfig } from '../../../../../configs/app.config';
import { QueueTrackCommand } from '../../../../core/cqrs/command-bus/commands/queue-track.command';
import { Track } from '../../../../core/modules/db/entities/track.entity';
import { QueuedTrackRepository } from '../../../../core/modules/db/repositories/queued-track.repository';
import { TrackRepository } from '../../../../core/modules/db/repositories/track.repository';
import { SlackService } from '../../../services/slack.service';
import { SlackCommand } from '../interfaces/slack-command';

@Injectable()
export class RefreshSlackCommand implements SlackCommand {
    description = 'zagram pioseneczkę, która była grana najdawniej';
    type = 'refresh';

    constructor(
        private commandBus: CommandBus,
        private slack: SlackService,
        @InjectRepository(QueuedTrackRepository) private queuedTrackRepository: QueuedTrackRepository,
        @InjectRepository(TrackRepository) private trackRepository: TrackRepository
    ) {
    }

    async handler(command: string[], message: any): Promise<any> {

        const queuedTracksCount = await this.queuedTrackRepository.createQueryBuilder('queuedTrack')
            .where('queuedTrack.playedAt IS NULL')
            .andWhere('queuedTrack.addedById = :userId')
            .setParameters({ userId: message.user })
            .getCount();

        if (queuedTracksCount >= appConfig.queuedTracksPerUser) {
            this.slack.rtm.sendMessage(`Osiągnąłeś limit ${appConfig.queuedTracksPerUser} zakolejkowanych utworów.`, message.channel);
            throw new Error('zakolejkowane');
        }

        const groupedTracksQuery = this.queuedTrackRepository.createQueryBuilder()
            .select('trackId, MAX(createdAt) as createdAt')
            .groupBy('trackId');

        const oldestTrack = await this.queuedTrackRepository.createQueryBuilder()
            .select('*')
            .from(`(${groupedTracksQuery.getQuery()})`, 'latest')
            .orderBy('latest.createdAt', 'ASC')
            .limit(1)
            .execute();

        if (oldestTrack[0] && oldestTrack[0].trackId) {
            const trackId = oldestTrack[0].trackId;
            const refreshTrack = await this.trackRepository.findOne(trackId);
            if (refreshTrack) {
                this.queueTrack(message, refreshTrack);
            }
        }
    }

    private async queueTrack(message: any, track: Track): Promise<void> {
        await this.commandBus.execute(new QueueTrackCommand(track.id, message.user, true));
        this.slack.rtm.sendMessage(`Odświeżamy! Dodałem ${track.title} do playlisty :)`, message.channel);
    }
}
