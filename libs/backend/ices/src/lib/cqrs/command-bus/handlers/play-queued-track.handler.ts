import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { QueuedTrack, QueuedTrackRepository } from '@sdj/backend/db';
import { Injectors, MicroservicePattern } from '@sdj/backend/shared';
import { RedisService } from '../../../services/redis.service';
import { PlayQueuedTrackCommand } from '../commands/play-queued-track.command';

@CommandHandler(PlayQueuedTrackCommand)
export class PlayQueuedTrackHandler
  implements ICommandHandler<PlayQueuedTrackCommand> {
  constructor(
    @Inject(Injectors.APPSERVICE) private readonly appService: ClientProxy,
    @Inject(Injectors.STORAGESERVICE)
    private readonly storageService: ClientProxy,
    private readonly redisService: RedisService,
    @InjectRepository(QueuedTrackRepository)
    private queuedTrackRepository: QueuedTrackRepository
  ) {}

  async execute(command: PlayQueuedTrackCommand): Promise<void> {
    const queuedTrack = await this.queuedTrackRepository.findOneOrFail(
      command.queuedTrackId
    );
    const track = queuedTrack.track;
    const prevTrack = await this.storageService
      .send(MicroservicePattern.getCurrentTrack, queuedTrack.playedIn.id)
      .toPromise();
    if (prevTrack) {
      this.storageService
        .send(MicroservicePattern.removeFromQueue, prevTrack)
        .toPromise();
    }
    this.redisService
      .getNextSongSubject(queuedTrack.playedIn.id)
      .next(<any>track.id);
    this.storageService
      .send(MicroservicePattern.setCurrentTrack, {
        channelId: queuedTrack.playedIn.id,
        queuedTrack
      })
      .toPromise();
    await this.updateQueuedTrackPlayedAt(queuedTrack);
    this.appService
      .emit(MicroservicePattern.playDj, queuedTrack.playedIn.id)
      .subscribe();
    return this.storageService
      .send(MicroservicePattern.setSilenceCount, {
        channelId: queuedTrack.playedIn.id,
        value: 0
      })
      .toPromise();
  }

  updateQueuedTrackPlayedAt(
    queuedTrack: QueuedTrack,
    playedAt?: Date
  ): Promise<QueuedTrack> {
    queuedTrack.playedAt = playedAt || new Date();
    return this.queuedTrackRepository.save(queuedTrack);
  }
}
