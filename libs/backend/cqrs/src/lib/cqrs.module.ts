import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreModule } from '@sdj/backend/core';
import { CreateTrackHandler } from './command-bus/handlers/create-track.handler';
import { DeleteQueuedTrackHandler } from './command-bus/handlers/delete-queued-track.handler';
import { DeleteTrackHandler } from './command-bus/handlers/delete-track.handler';
import { DownloadTrackHandler } from './command-bus/handlers/download-track.handler';
import { FuckYouHandler } from './command-bus/handlers/fuck-you.handler';
import { HeartHandler } from './command-bus/handlers/heart.handler';
import { PlayTrackHandler } from './command-bus/handlers/play-track.hander';
import { QueueTrackHandler } from './command-bus/handlers/queue-track.handler';
import { ThumbDownHandler } from './command-bus/handlers/thumb-down.handler';
import { ThumbUpHandler } from './command-bus/handlers/thumb-up.handler';
import { CqrsController } from './controllers/cqrs.controller';

export const CommandHandlers = [
  CreateTrackHandler,
  DeleteQueuedTrackHandler,
  DeleteTrackHandler,
  DownloadTrackHandler,
  FuckYouHandler,
  HeartHandler,
  PlayTrackHandler,
  QueueTrackHandler,
  ThumbDownHandler,
  ThumbUpHandler
];

@Module({
  imports: [CqrsModule, CoreModule, TypeOrmModule.forRoot({
    'type': 'mysql',
    'host': 'database',
    'port': 3306,
    'username': 'sdj',
    'password': 'sdj123123',
    'database': 'slack_dj', autoLoadEntities: true
  })],
  providers: [...CommandHandlers],
  controllers: [CqrsController]
})
export class SdjCqrsModule {}
