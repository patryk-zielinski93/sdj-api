import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { appConfig } from '../../../../../configs/app.config';
import { DownloadTrackCommand } from '../../../../core/cqrs/command-bus/commands/download-track.command';
import { QueueTrackCommand } from '../../../../core/cqrs/command-bus/commands/queue-track.command';
import { Track } from '../../../../core/modules/db/entities/track.entity';
import { QueuedTrackRepository } from '../../../../core/modules/db/repositories/queued-track.repository';
import { TrackRepository } from '../../../../core/modules/db/repositories/track.repository';
import { SlackService } from '../../../services/slack.service';
import { SlackCommand } from '../interfaces/slack-command';
import { SlackMessage } from '../interfaces/slack-message.interface';

@Injectable()
export class RandSlackCommand implements SlackCommand {
    description = 'wylosuję pioseneczkę i dodam do listy utworów';
    type = 'rand';

    constructor(private readonly commandBus: CommandBus,
                private slack: SlackService,
                @InjectRepository(QueuedTrackRepository) private queuedTrackRepository: QueuedTrackRepository,
                @InjectRepository(TrackRepository) private trackRepository: TrackRepository
    ) {
    }

    async handler(command: string[], message: SlackMessage): Promise<void> {
        const queuedTracksCount = await this.queuedTrackRepository.countTracksInQueueFromUser(message.user, message.channel);

        if (queuedTracksCount >= appConfig.queuedTracksPerUser) {
            this.slack.rtm.sendMessage(`Osiągnąłeś limit ${appConfig.queuedTracksPerUser} zakolejkowanych utworów.`, message.channel);
            throw new Error('zakolejkowane');
        }

        const randTrack = await this.trackRepository.getRandomTrack(message.channel);

        if (randTrack) {
            this.commandBus.execute(new DownloadTrackCommand(randTrack.id))
                .then(() => {
                    this.queueTrack(message, randTrack);
                });
        }
    }

    private async queueTrack(message: any, track: Track): Promise<void> {
        this.commandBus.execute(new QueueTrackCommand(track.id, message.channel, message.user))
            .then(() => {
                this.slack.rtm.sendMessage(`Dodałem ${track.title} do playlisty :)`, message.channel);
            });
    }
}
