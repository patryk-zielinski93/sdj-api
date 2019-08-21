import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisService } from '../../../services/redis.service';
import { PlaylistStore } from '../../../../../../core/src/lib/store/playlist.store';
import { PlayQueuedTrackCommand } from '../commands/play-queued-track.command';
import { QueuedTrackRepository, QueuedTrack } from '@sdj/backend/db';
import { PlayDjEvent } from '../../events/play-dj.event';
import { Inject } from '@nestjs/common';
import { Injectors, MicroservicePattern } from '@sdj/backend/shared';
import { ClientProxy } from '@nestjs/microservices';

@CommandHandler(PlayQueuedTrackCommand)
export class PlayQueuedTrackHandler
  implements ICommandHandler<PlayQueuedTrackCommand> {
  constructor(
    @Inject(Injectors.APPSERVICE) private readonly client: ClientProxy,
    private readonly playlistStore: PlaylistStore,
    private readonly redisService: RedisService,
    @InjectRepository(QueuedTrackRepository)
    private queuedTrackRepository: QueuedTrackRepository
  ) {}

  async execute(command: PlayQueuedTrackCommand): Promise<void> {
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
      .next(<any>track.id);
    this.playlistStore.setCurrentTrack(queuedTrack.playedIn.id, queuedTrack);
    await this.updateQueuedTrackPlayedAt(queuedTrack);
    this.client.emit(MicroservicePattern.playDj, queuedTrack.playedIn.id).subscribe();
    return this.playlistStore.setSilenceCount(queuedTrack.playedIn.id, 0);
  }

  updateQueuedTrackPlayedAt(
    queuedTrack: QueuedTrack,
    playedAt?: Date
  ): Promise<QueuedTrack> {
    queuedTrack.playedAt = playedAt || new Date();
    return this.queuedTrackRepository.save(queuedTrack);
  }
}
