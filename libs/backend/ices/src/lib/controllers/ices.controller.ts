import { Controller } from '@nestjs/common';
import { RedisService } from '../services/redis.service';
import { QueuedTrack } from '@sdj/backend/db';
import { MessagePattern } from '@nestjs/microservices';
import { MicroservicePattern } from '@sdj/backend/shared';

@Controller('ices')
export class IcesController {
  constructor(private readonly redisService: RedisService) {}
  @MessagePattern(MicroservicePattern.nextSong)
  nextSong(queuedTrack: QueuedTrack): void {
    this.redisService
      .getNextSongSubject(queuedTrack.playedIn.id)
      .next(<any>queuedTrack.track.id);
  }

  @MessagePattern(MicroservicePattern.playSilence)
  playSilence(channelId: string): void {
    this.redisService
      .getNextSongSubject(channelId)
      .next(<any>'10-sec-of-silence');
  }
}
