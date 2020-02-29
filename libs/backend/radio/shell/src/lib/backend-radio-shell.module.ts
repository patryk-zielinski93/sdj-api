import { Global, Module } from '@nestjs/common';
import { BackendRadioCoreApplicationServicesModule } from '@sdj/backend/radio/core/application-services';
import {
  ChannelDomainRepository,
  QueuedTrackDomainRepository,
  TrackDomainRepository,
  UserDomainRepository,
  VoteDomainRepository
} from '@sdj/backend/radio/core/domain-service';
import {
  BackendRadioInfrastructureModule,
  ChannelRepositoryAdapter,
  QueuedTrackRepositoryAdapter,
  TrackRepositoryAdapter,
  UserRepositoryAdapter,
  VoteRepositoryAdapter
} from '@sdj/backend/radio/infrastructure';
import { DbModule } from './db.module';

const providers = [
  { provide: ChannelDomainRepository, useClass: ChannelRepositoryAdapter },
  {
    provide: QueuedTrackDomainRepository,
    useClass: QueuedTrackRepositoryAdapter
  },
  { provide: TrackDomainRepository, useClass: TrackRepositoryAdapter },
  { provide: UserDomainRepository, useClass: UserRepositoryAdapter },
  { provide: VoteDomainRepository, useClass: VoteRepositoryAdapter }
];
@Global()
@Module({
  imports: [
    DbModule,
    BackendRadioCoreApplicationServicesModule,
    BackendRadioInfrastructureModule
  ],
  providers: providers,
  exports: [
    DbModule,
    ...providers,
    BackendRadioCoreApplicationServicesModule,
    BackendRadioInfrastructureModule
  ] // TODo hide infrastructure
})
export class BackendRadioShellModule {}
