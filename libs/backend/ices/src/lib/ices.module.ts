import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { BackendRadioShellModule } from '@sdj/backend/radio/shell';
import { PlaySilenceHandler } from '../../../radio/core/application-services/src/lib/events/play-silence/play-silence.handler';
import { DownloadAndPlayHandler } from './cqrs/command-bus/handlers/download-and-play.handler';
import { IcesPlayQueuedTrackHandler } from './cqrs/events/play-queued-track/ices-play-queued-track.handler';
import { RedisGetNextHandler } from './cqrs/events/regis-get-next/redis-get-next.handler';
import { RedisSagas } from './cqrs/events/sagas/redis.sagas';
import { RedisService } from './services/redis.service';

export const CommandHandlers = [DownloadAndPlayHandler, PlaySilenceHandler];
export const EventsHandlers = [IcesPlayQueuedTrackHandler];

@Module({
  imports: [BackendRadioShellModule, CqrsModule],
  providers: [
    RedisSagas,
    RedisService,
    RedisGetNextHandler,
    ...CommandHandlers,
    ...EventsHandlers
  ]
})
export class IcesModule {}
