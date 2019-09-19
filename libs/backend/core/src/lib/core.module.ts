import { Global, Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { CommonModule } from '@sdj/backend/common';
import { microservices } from '@sdj/backend/config';
import { DbModule } from '@sdj/backend/db';
import { Injectors } from '@sdj/backend/shared';
import { AppServiceFacade } from './services/app-service.facade';
import { CqrsServiceFacade } from './services/cqrs-service.facade';
import { Mp3Service } from './services/mp3.service';
import { PlaylistService } from './services/playlist.service';
import { StorageServiceFacade } from './services/storage-service.facade';
import { CqrsModule } from '@nestjs/cqrs';

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
  imports: [DbModule, ClientsModuleRegistered, CqrsModule, CommonModule],
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
    CommonModule,
    CqrsServiceFacade,
    DbModule,
    Mp3Service,
    PlaylistService,
    StorageServiceFacade
  ]
})
export class CoreModule {}
