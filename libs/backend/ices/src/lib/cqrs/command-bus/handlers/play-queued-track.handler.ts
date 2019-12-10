import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { AppServiceFacade, StorageServiceFacade } from '@sdj/backend/core';
import { QueuedTrack, QueuedTrackRepository } from '@sdj/backend/db';
import { RedisService } from '../../../services/redis.service';
import { PlayQueuedTrackCommand } from '../commands/play-queued-track.command';

@CommandHandler(PlayQueuedTrackCommand)
export class PlayQueuedTrackHandler
  implements ICommandHandler<PlayQueuedTrackCommand> {
  constructor(
    private readonly appService: AppServiceFacade,
    private readonly storageService: StorageServiceFacade,
    private readonly redisService: RedisService,
    @InjectRepository(QueuedTrackRepository)
    private queuedTrackRepository: QueuedTrackRepository
  ) {}

  async execute(command: PlayQueuedTrackCommand): Promise<void> {
    const queuedTrack = await this.queuedTrackRepository.findOneOrFail(
      command.queuedTrackId
    );
    const channelId = queuedTrack.playedIn.id;
    const track = queuedTrack.track;
    const prevTrack = await this.storageService.getCurrentTrack(channelId);
    console.log('prevTrack', !!prevTrack);
    if (prevTrack) {
      this.storageService.removeFromQueue(prevTrack);
    }
    this.redisService.sendNextSong(channelId, track);
    this.storageService.setCurrentTrack(channelId, queuedTrack);
    await this.updateQueuedTrackPlayedAt(queuedTrack);
    this.appService.playDj(channelId);
    return this.storageService.setSilenceCount(channelId, 0);
  }

  updateQueuedTrackPlayedAt(
    queuedTrack: QueuedTrack,
    playedAt?: Date
  ): Promise<QueuedTrack> {
    queuedTrack.playedAt = playedAt || new Date();
    return this.queuedTrackRepository.save(queuedTrack);
  }
}
