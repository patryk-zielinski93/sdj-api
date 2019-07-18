import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisService } from '../../../services/redis.service';
import { PlaylistStore } from '../../../store/playlist.store';
import { PlayDjEvent } from '../../events/play-dj.event';
import { PlayQueuedTrackCommand } from '../commands/play-queued-track.command';
import { QueuedTrackRepository, QueuedTrack } from '@sdj/backend/db';

@CommandHandler(PlayQueuedTrackCommand)
export class PlayQueuedTrackHandler
  implements ICommandHandler<PlayQueuedTrackCommand> {
  constructor(
    private readonly publisher: EventBus,
    private readonly playlistStore: PlaylistStore,
    private readonly redisService: RedisService,
    @InjectRepository(QueuedTrackRepository)
    private queuedTrackRepository: QueuedTrackRepository
  ) {}

  async execute(command: PlayQueuedTrackCommand) {
    const queuedTrack = await this.queuedTrackRepository.findOneOrFail(
      command.queuedTrackId
    );
    const track = queuedTrack.track;
    const prevTrack = await this.playlistStore.getCurrentTrack(
      queuedTrack.playedIn.id
    );
    if (prevTrack) {
      this.playlistStore.removeFromQueue(prevTrack);
    }
    this.redisService
      .getNextSongSubject(queuedTrack.playedIn.id)
      .next(track.id);
    this.playlistStore.setCurrentTrack(queuedTrack.playedIn.id, queuedTrack);
    this.publisher.publish(new PlayDjEvent(queuedTrack.playedIn.id));
    this.updateQueuedTrackPlayedAt(queuedTrack);
    this.playlistStore.setSilenceCount(queuedTrack.playedIn.id, 0);
  }

  updateQueuedTrackPlayedAt(
    queuedTrack: QueuedTrack,
    playedAt?: Date
  ): Promise<QueuedTrack> {
    queuedTrack.playedAt = playedAt || new Date();
    return this.queuedTrackRepository.save(queuedTrack);
  }
}
