import { NgModule } from '@angular/core';
import { NgCoreRadioApplicationServicesModule } from '@sdj/ng/core/radio/application-services';
import { NgCoreSharedInfrastructureApolloModule } from '@sdj/ng/core/shared/infrastructure-apollo';
import { SpeechServiceAdapter } from '@sdj/ng/core/shared/infrastructure-speech';
import { WebSocketClientAdapter } from '@sdj/ng/core/shared/infrastructure-web-socket';
import { SpeechService, WebSocketClient } from '@sdj/ng/core/shared/port';

@NgModule({
  imports: [
    NgCoreRadioApplicationServicesModule,
    NgCoreSharedInfrastructureApolloModule
  ],
  providers: [
    { provide: SpeechService, useClass: SpeechServiceAdapter },
    { provide: WebSocketClient, useExisting: WebSocketClientAdapter }
  ]
})
export class NgCoreRadioShellModule {}
