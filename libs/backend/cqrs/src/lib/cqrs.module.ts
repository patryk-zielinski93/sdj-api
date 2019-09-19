import { CreateTrackHandler } from './command-bus/handlers/create-track.handler';
import { DeleteTrackHandler } from './command-bus/handlers/delete-track.handler';
import { DownloadTrackHandler } from './command-bus/handlers/download-track.handler';
import { FuckYouHandler } from './command-bus/handlers/fuck-you.handler';
import { HeartHandler } from './command-bus/handlers/heart.handler';
import { QueueTrackHandler } from './command-bus/handlers/queue-track.handler';
import { ThumbDownHandler } from './command-bus/handlers/thumb-down.handler';
import { ThumbUpHandler } from './command-bus/handlers/thumb-up.handler';
import { CoreModule } from '@sdj/backend/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsController } from './controllers/cqrs.controller';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PlayTrackHandler } from './command-bus/handlers/play-track.hander';

export const CommandHandlers = [
  CreateTrackHandler,
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
  imports: [CqrsModule, CoreModule, TypeOrmModule.forRoot()],
  providers: [...CommandHandlers],
  controllers: [CqrsController]
})
export class SdjCqrsModule {}
