import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule } from '@nestjs/microservices';
import { CommonModule } from '@sdj/backend/common';
import { microservices } from '@sdj/backend/config';
import { DbModule } from '@sdj/backend/db';
import { Injectors } from '@sdj/backend/shared';
import { CreateTrackHandler } from './cqrs/command-bus/handlers/create-track.handler';
import { DownloadTrackHandler } from './cqrs/command-bus/handlers/download-track.handler';
import { FuckYouHandler } from './cqrs/command-bus/handlers/fuck-you.handler';
import { HeartHandler } from './cqrs/command-bus/handlers/heart.handler';
import { QueueTrackHandler } from './cqrs/command-bus/handlers/queue-track.handler';
import { ThumbUpHandler } from './cqrs/command-bus/handlers/thumb-up.handler';
import { Mp3Service } from './services/mp3.service';
import { PlaylistService } from './services/playlist.service';

export const CommandHandlers = [
  CreateTrackHandler,
  DownloadTrackHandler,
  FuckYouHandler,
  HeartHandler,
  QueueTrackHandler,
  ThumbUpHandler
];

const ClientsModuleRegistered = ClientsModule.register([
  {
    name: Injectors.APPSERVICE,
    ...microservices.app
  },
  {
    name: Injectors.ICESSERVICE,
    ...microservices.ices
  },
  {
    name: Injectors.SLACKSERVICE,
    ...microservices.slack
  },
  {
    name: Injectors.STORAGESERVICE,
    ...microservices.storage
  }
]);

@Global()
@Module({
  imports: [DbModule, ClientsModuleRegistered, CommonModule, CqrsModule],
  providers: [...CommandHandlers, Mp3Service, PlaylistService],
  exports: [
    Mp3Service,
    PlaylistService,
    DbModule,
    ClientsModuleRegistered,
    CqrsModule,
    CommonModule
  ]
})
export class CoreModule {}
