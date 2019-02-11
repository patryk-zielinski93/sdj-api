import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { PlayRadioEvent } from '../../events/play-radio.event';
import { RedisService } from '../../../services/redis.service';
import { PlaylistStore } from '../../../store/playlist.store';
import { PlaySilenceCommand } from '../commands/play-silence.command';

@CommandHandler(PlaySilenceCommand)
export class PlaySilenceHandler implements ICommandHandler<PlaySilenceCommand> {
    constructor(private readonly publisher: EventBus,
                private redisService: RedisService,
                private readonly playlistStore: PlaylistStore) {
    }

    async execute(command: PlaySilenceCommand, resolve: (value?) => void) {
        const count = this.playlistStore.state.getValue().silenceCount + 1;
        this.playlistStore.setSilenceCount(count);
        if (count > 1) {
            this.publisher.publish(new PlayRadioEvent());
        }
        this.redisService.getNextSongSubject().next('10-sec-of-silence');
        resolve();
    }
}
