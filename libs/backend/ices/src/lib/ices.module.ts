import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreModule } from '@sdj/backend/core';
import { DownloadAndPlayHandler } from './cqrs/command-bus/handlers/download-and-play.handler';
import { PlayQueuedTrackHandler } from './cqrs/command-bus/handlers/play-queued-track.handler';
import { PlaySilenceHandler } from './cqrs/command-bus/handlers/play-silence.handler';
import { RedisGetNextHandler } from './cqrs/events/handlers/redis-get-next.handler';
import { RedisSagas } from './cqrs/events/sagas/redis.sagas';
import { RedisService } from './services/redis.service';

export const CommandHandlers = [
  DownloadAndPlayHandler,
  PlayQueuedTrackHandler,
  PlaySilenceHandler
];
@Module({
  imports: [CoreModule, CqrsModule, TypeOrmModule.forRoot()],
  providers: [RedisSagas, RedisService, RedisGetNextHandler, ...CommandHandlers]
})
export class IcesModule {}
