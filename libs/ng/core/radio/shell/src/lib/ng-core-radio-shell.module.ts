import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgCoreRadioApplicationServicesModule } from '@sdj/ng/core/radio/application-services';
import { QueuedTrackRepository } from '@sdj/ng/core/radio/domain-services';
import { QueuedTrackRepositoryAdapter } from '@sdj/ng/core/radio/infrastructure';
import { NgCoreSharedInfrastructureApolloModule } from '@sdj/ng/core/shared/infrastructure-apollo';
import { SpeechServiceAdapter } from '@sdj/ng/core/shared/infrastructure-speech';
import { WebSocketClientAdapter } from '@sdj/ng/core/shared/infrastructure-web-socket';
import { SpeechService, WebSocketClient } from '@sdj/ng/core/shared/port';

@NgModule({
  imports: [
    CommonModule,
    NgCoreRadioApplicationServicesModule,
    NgCoreSharedInfrastructureApolloModule
  ],
  providers: [
    { provide: SpeechService, useClass: SpeechServiceAdapter },
    {
      provide: QueuedTrackRepository,
      useClass: QueuedTrackRepositoryAdapter
    },
    { provide: WebSocketClient, useExisting: WebSocketClientAdapter }
  ]
})
export class NgCoreRadioShellModule {}
