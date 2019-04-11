import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { appConfig } from '../../../../../configs/app.config';
import { CreateTrackCommand } from '../../../../core/cqrs/command-bus/commands/create-track.command';
import { DownloadTrackCommand } from '../../../../core/cqrs/command-bus/commands/download-track.command';
import { QueueTrackCommand } from '../../../../core/cqrs/command-bus/commands/queue-track.command';
import { Track } from '../../../../core/modules/db/entities/track.entity';
import { QueuedTrackRepository } from '../../../../core/modules/db/repositories/queued-track.repository';
import { TrackRepository } from '../../../../core/modules/db/repositories/track.repository';
import { Utils } from '../../../../core/utils/utils';
import { SlackService } from '../../../services/slack.service';
import { SlackCommand } from '../interfaces/slack-command';

@Injectable()
export class PlayTrackSlackCommand implements SlackCommand {
    description = '`[youtubeUrl]` - jeżeli chcesz żebym zapuścił Twoją pioseneczkę, koniecznie wypróbuj to polecenie';
    type = 'play';

    constructor(
        private readonly commandBus: CommandBus,
        private slack: SlackService,
        @InjectRepository(QueuedTrackRepository) private queuedTrackRepository: QueuedTrackRepository,
        @InjectRepository(TrackRepository) private trackRepository: TrackRepository
    ) {
    }

    async handler(command: string[], message: any): Promise<any> {
        //ToDO move to QueueTrackHandler
        const queuedTracksCount = await this.queuedTrackRepository.countTracksInQueueFromUser(message.user);

        if (queuedTracksCount >= appConfig.queuedTracksPerUser) {
            this.slack.rtm.sendMessage(`Masz przekroczony limit ${appConfig.queuedTracksPerUser} zakolejkowanych utworów.`, message.channel);
            throw new Error('zakolejkowane');
        }

        const id = Utils.extractVideoIdFromYoutubeUrl(command[1].slice(1, -1));
        if (!id) {
            throw new Error('invalid url');
        }

        const track = await this.trackRepository.findOne(id);

        if (track) {
            if (track.skips >= appConfig.skipsToBan) {
                //ToDO move to QueueTrackHandler
                console.log('Song is banned');
                return;
            }

            this.commandBus.execute(new DownloadTrackCommand(track.id))
                .then(() => {
                    this.queueTrack(message, track);
                });
        } else {
            this.commandBus.execute(new CreateTrackCommand(id, message.user))
                .then((newTrack: Track) => {
                    this.queueTrack(message, newTrack);
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
