import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DbModule } from '@sdj/backend/db';
import { CreateTrackHandler } from './cqrs/command-bus/handlers/create-track.handler';
import { DownloadAndPlayHandler } from './cqrs/command-bus/handlers/download-and-play.handler';
import { DownloadTrackHandler } from './cqrs/command-bus/handlers/download-track.handler';
import { FuckYouHandler } from './cqrs/command-bus/handlers/fuck-you.handler';
import { HeartHandler } from './cqrs/command-bus/handlers/heart.handler';
import { PlayQueuedTrackHandler } from './cqrs/command-bus/handlers/play-queued-track.handler';
import { PlaySilenceHandler } from './cqrs/command-bus/handlers/play-silence.handler';
import { QueueTrackHandler } from './cqrs/command-bus/handlers/queue-track.handler';
import { ThumbUpHandler } from './cqrs/command-bus/handlers/thumb-up.handler';
import { RedisGetNextHandler } from './cqrs/events/handlers/redis-get-next.handler';
import { RedisSagas } from './cqrs/events/sagas/redis.sagas';
import { Mp3Service } from './services/mp3.service';
import { PlaylistService } from './services/playlist.service';
import { RedisService } from './services/redis.service';
import { PlaylistStore } from './store/playlist.store';
import { CommonModule } from '@sdj/backend/common';

export const CommandHandlers = [
  CreateTrackHandler,
  DownloadAndPlayHandler,
  DownloadTrackHandler,
  FuckYouHandler,
  HeartHandler,
  PlayQueuedTrackHandler,
  PlaySilenceHandler,
  QueueTrackHandler,
  ThumbUpHandler
];

export const EventHandlers = [RedisGetNextHandler];

@Global()
@Module({
  imports: [DbModule, CommonModule, CqrsModule],
  providers: [
    ...CommandHandlers,
    ...EventHandlers,
    Mp3Service,
    PlaylistService,
    PlaylistStore,
    RedisSagas,
    RedisService
  ],
  exports: [
    Mp3Service,
    PlaylistService,
    PlaylistStore,
    RedisService,
    DbModule,
    CqrsModule,
    CommonModule
  ]
})
export class CoreModule {}
