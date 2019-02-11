import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { appConfig } from '../../../../../configs/app.config';
import { Track } from '../../../../core/modules/db/entities/track.model';
import { QueuedTrackRepository } from '../../../../core/modules/db/repositories/queued-track.repository';
import { TrackRepository } from '../../../../core/modules/db/repositories/track.repository';
import { SlackService } from '../../../services/slack.service';
import { SlackCommand } from '../interfaces/slack-command';
import { DownloadTrackCommand } from "../../../../core/cqrs/command-bus/commands/download-track.command";
import { CommandBus } from '@nestjs/cqrs';
import { QueueTrackCommand } from "../../../../core/cqrs/command-bus/commands/queue-track.command";

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

    async handler(command: string[], message: any): Promise<any> {
        const queuedTracksCount = await this.queuedTrackRepository.countTracksInQueueFromUser(message.user);

        if (queuedTracksCount >= appConfig.queuedTracksPerUser) {
            this.slack.rtm.sendMessage(`Osiągnąłeś limit ${appConfig.queuedTracksPerUser} zakolejkowanych utworów.`, message.channel);
            throw new Error('zakolejkowane');
        }

        const randTrack = await this.trackRepository.getRandomTrack();

        if (randTrack) {
            this.commandBus.execute(new DownloadTrackCommand(randTrack))
                .then(() => {
                    this.queueTrack(message, randTrack);
                });
        }
    }

    private async queueTrack(message: any, track: Track): Promise<void> {
        this.commandBus.execute(new QueueTrackCommand(track.id, message.user))
            .then(() => {
                this.slack.rtm.sendMessage(`Dodałem ${track.title} do playlisty :)`, message.channel);
            });
    }
}
