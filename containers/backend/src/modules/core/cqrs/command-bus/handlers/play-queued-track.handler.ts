import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { QueuedTrack } from '../../../modules/db/entities/queued-track.entity';
import { QueuedTrackRepository } from '../../../modules/db/repositories/queued-track.repository';
import { RedisService } from '../../../services/redis.service';
import { PlaylistStore } from '../../../store/playlist.store';
import { PlayDjEvent } from '../../events/play-dj.event';
import { PlayQueuedTrackCommand } from '../commands/play-queued-track.command';
import { ChannelRepository } from '../../../modules/db/repositories/channel.repository';

@CommandHandler(PlayQueuedTrackCommand)
export class PlayQueuedTrackHandler implements ICommandHandler<PlayQueuedTrackCommand> {
    constructor(private readonly publisher: EventBus,
                private readonly playlistStore: PlaylistStore,
                private readonly redisService: RedisService,
                @InjectRepository(ChannelRepository) private channelRepository: ChannelRepository,
                @InjectRepository(QueuedTrackRepository) private queuedTrackRepository: QueuedTrackRepository) {
    }

    async execute(command: PlayQueuedTrackCommand, resolve: (value?) => void) {
        const queuedTrack = await this.queuedTrackRepository.findOneOrFail(command.queuedTrackId);
        const track = queuedTrack.track;
        const prevTrack = await this.queuedTrackRepository.getCurrentTrack('');
        if (prevTrack) {
            this.playlistStore.removeFromQueue(prevTrack);
        }
        this.redisService.getNextSongSubject(queuedTrack.playedIn.id).next(track.id);
        this.publisher.publish(new PlayDjEvent(queuedTrack.playedIn.id));
        this.updateQueuedTrackPlayedAt(queuedTrack);
        this.playlistStore.setSilenceCount(0);
        resolve();
    }

    updateQueuedTrackPlayedAt(queuedTrack: QueuedTrack, playedAt?: Date): Promise<QueuedTrack> {
        queuedTrack.playedAt = playedAt || new Date();
        return this.queuedTrackRepository.save(queuedTrack);
    }
}
