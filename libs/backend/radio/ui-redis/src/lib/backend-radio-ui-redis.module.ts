import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { BackendRadioShellModule } from '@sdj/backend/radio/shell';
import { RedisController } from './controllers/redis.controller';
import { IcesPlayQueuedTrackHandler } from './events/play-queued-track/ices-play-queued-track.handler';
import { IcesPlaySilenceHandler } from './events/play-silence/ices-play-silence.handler';
import { RedisRouter } from './services/redis.router';
import { RedisService } from './services/redis.service';

export const EventsHandlers = [
  IcesPlayQueuedTrackHandler,
  IcesPlaySilenceHandler
];

@Module({
  imports: [BackendRadioShellModule, CqrsModule],
  providers: [RedisService, RedisController, RedisRouter, ...EventsHandlers]
})
export class BackendRadioUiRedisModule {}
