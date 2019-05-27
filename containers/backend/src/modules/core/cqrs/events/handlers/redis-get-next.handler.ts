import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Channel } from '../../../modules/db/entities/channel.entity';
import { QueuedTrack } from '../../../modules/db/entities/queued-track.entity';
import { PlaylistService } from '../../../services/playlist.service';
import { PlaylistStore } from '../../../store/playlist.store';
import { DownloadAndPlayCommand } from '../../command-bus/commands/download-and-play.command';
import { PlaySilenceCommand } from '../../command-bus/commands/play-silence.command';
import { RedisGetNextEvent } from '../redis-get-next.event';

@EventsHandler(RedisGetNextEvent)
export class RedisGetNextHandler implements IEventHandler<RedisGetNextEvent> {
    constructor(private readonly commandBus: CommandBus, private playlistStore: PlaylistStore, private playlist: PlaylistService) {
    }

    handle(event: RedisGetNextEvent): any {
        this.playlistStore.startHandlingNextSong();
        this.playlist.getNext({} as Channel)
            .then(async (queuedTrack: QueuedTrack | undefined) => {
                if (queuedTrack) {
                    this.commandBus.execute(new DownloadAndPlayCommand(queuedTrack))
                        .then(() => {
                            this.playlistStore.endHandlingNextSong();
                        });
                } else {
                    this.commandBus.execute(new PlaySilenceCommand())
                        .then(() => {
                            this.playlistStore.endHandlingNextSong();
                        });
                }
            });
    }

}
