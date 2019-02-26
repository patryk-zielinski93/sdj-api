import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { QueuedTrackRepository } from '../../../modules/db/repositories/queued-track.repository';
import { TrackRepository } from '../../../modules/db/repositories/track.repository';
import { RedisService } from '../../../services/redis.service';
import { PlaylistStore } from '../../../store/playlist.store';
import { QueueTrackCommand } from '../commands/queue-track.command';

@CommandHandler(QueueTrackCommand)
export class QueueTrackHandler implements ICommandHandler<QueueTrackCommand> {
    constructor(private readonly publisher: EventBus,
                private readonly playlistStore: PlaylistStore,
                private readonly redisService: RedisService,
                @InjectRepository(QueuedTrackRepository) private queuedTrackRepository: QueuedTrackRepository,
                @InjectRepository(TrackRepository) private readonly trackRepository: TrackRepository) {
    }

    async execute(command: QueueTrackCommand, resolve: (value?) => void) {
        const track = await this.trackRepository.findOneOrFail(command.trackId);
        const queuedTrack = await this.queuedTrackRepository.queueTrack(track, command.randomized, command.addedBy);
        this.playlistStore.addToQueue(queuedTrack);
        resolve();
    }
}
