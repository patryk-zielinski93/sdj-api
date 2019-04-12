import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { QueuedTrackRepository } from '../../../modules/db/repositories/queued-track.repository';
import { RedisService } from '../../../services/redis.service';
import { PlaylistStore } from '../../../store/playlist.store';
import { PlayRadioEvent } from '../../events/play-radio.event';
import { PlaySilenceCommand } from '../commands/play-silence.command';

@CommandHandler(PlaySilenceCommand)
export class PlaySilenceHandler implements ICommandHandler<PlaySilenceCommand> {
    constructor(private readonly publisher: EventBus,
                private redisService: RedisService,
                private readonly playlistStore: PlaylistStore,
                @InjectRepository(QueuedTrackRepository) private queuedTrackRepository: QueuedTrackRepository) {
    }

    async execute(command: PlaySilenceCommand, resolve: (value?) => void) {
        const count = this.playlistStore.state.silenceCount + 1;
        this.playlistStore.setSilenceCount(count);
        const prevTrack = await this.queuedTrackRepository.getCurrentTrack('');
        if (prevTrack) {
            this.playlistStore.removeFromQueue(prevTrack);
        }
        if (count > 1) {
            this.publisher.publish(new PlayRadioEvent());
        }
        this.redisService.getNextSongSubject().next('10-sec-of-silence');
        resolve();
    }
}
