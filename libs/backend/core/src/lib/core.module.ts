import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule } from '@nestjs/microservices';
import { DbModule } from '@sdj/backend/db';
import { microservices } from '@sdj/backend/shared/config';
import { Injectors } from '@sdj/backend/shared/domain';
import { LoggerModule } from '@sdj/backend/shared/logger';
import { AppServiceFacade } from './services/app-service.facade';
import { CqrsServiceFacade } from './services/cqrs-service.facade';
import { Mp3Service } from './services/mp3.service';
import { PlaylistService } from './services/playlist.service';
import { StorageServiceFacade } from './services/storage-service.facade';

const ClientsModuleRegistered = ClientsModule.register([
  {
    name: Injectors.APPSERVICE,
    ...microservices.app
  },
  {
    name: Injectors.CQRSSERVICE,
    ...microservices.cqrs
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
  imports: [DbModule, ClientsModuleRegistered, CqrsModule, LoggerModule],
  providers: [
    AppServiceFacade,
    CqrsServiceFacade,
    Mp3Service,
    PlaylistService,
    StorageServiceFacade
  ],
  exports: [
    AppServiceFacade,
    ClientsModuleRegistered,
    CqrsModule,
    CqrsServiceFacade,
    DbModule,
    Mp3Service,
    PlaylistService,
    StorageServiceFacade,
    LoggerModule
  ]
})
export class CoreModule {}
