import { NgModule } from '@angular/core';
import { NgCoreSharedInfrastructureApolloModule } from '@sdj/ng/core/shared/infrastructure-apollo';
import { NgCoreTrackApplicationServicesModule } from '@sdj/ng/core/track/application-services';
import { TrackRepository } from '@sdj/ng/core/track/domain-services';
import { TrackRepositoryAdapter } from '@sdj/ng/core/track/infrastrucutre';

@NgModule({
  imports: [
    NgCoreTrackApplicationServicesModule,
    NgCoreSharedInfrastructureApolloModule
  ],
  providers: [
    {
      provide: TrackRepository,
      useClass: TrackRepositoryAdapter
    }
  ]
})
export class NgCoreTrackShellModule {}
