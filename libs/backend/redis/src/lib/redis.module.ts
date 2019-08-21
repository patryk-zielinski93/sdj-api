import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { connectionConfig } from '@sdj/backend/config';
import { CoreModule } from '@sdj/backend/core';
import { Injectors } from '@sdj/backend/shared';
import { RedisService } from './services/redis.service';
import { RedisGetNextHandler } from './cqrs/events/handlers/redis-get-next.handler';
import { DownloadAndPlayHandler } from './cqrs/command-bus/handlers/download-and-play.handler';
import { PlayQueuedTrackHandler } from './cqrs/command-bus/handlers/play-queued-track.handler';
import { PlaySilenceHandler } from './cqrs/command-bus/handlers/play-silence.handler';
import { RedisSagas } from './cqrs/events/sagas/redis.sagas';

export const CommandHandlers = [
  DownloadAndPlayHandler,
  PlayQueuedTrackHandler,
  PlaySilenceHandler
];
@Module({
  imports: [
    CoreModule,
    TypeOrmModule.forRoot()
  ],
  providers: [RedisSagas, RedisService, RedisGetNextHandler, ...CommandHandlers]
})
export class RedisModule {}
