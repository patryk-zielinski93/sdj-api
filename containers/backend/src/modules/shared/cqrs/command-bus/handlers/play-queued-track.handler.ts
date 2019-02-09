import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { PlayDjEvent } from '../../events/play-dj.event';
import { QueuedTrack } from '../../../modules/db/entities/queued-track.model';
import { QueuedTrackRepository } from '../../../modules/db/repositories/queued-track.repository';
import { RedisService } from '../../../services/redis.service';
import { PlaylistStore } from '../../../store/playlist.store';
import { PlayQueuedTrackCommand } from '../commands/play-queued-track.command';

@CommandHandler(PlayQueuedTrackCommand)
export class PlayQueuedTrackHandler implements ICommandHandler<PlayQueuedTrackCommand> {
    constructor(private readonly publisher: EventBus,
                private readonly playlistStore: PlaylistStore,
                private readonly redisService: RedisService,
                @InjectRepository(QueuedTrackRepository) private queuedTrackRepository: QueuedTrackRepository) {
    }

    async execute(command: PlayQueuedTrackCommand, resolve: (value?) => void) {
        const queuedTrack = command.queuedTrack;
        this.redisService.getNextSongSubject().next(queuedTrack.track.id);
        this.publisher.publish(new PlayDjEvent());
        this.updateQueuedTrackPlayedAt(queuedTrack);
        this.playlistStore.setSilenceCount(0);
        resolve();
    }

    updateQueuedTrackPlayedAt(queuedTrack: QueuedTrack, playedAt?: Date): Promise<QueuedTrack> {
        queuedTrack.playedAt = playedAt || new Date();

        return this.queuedTrackRepository.save(queuedTrack);
    }
}
