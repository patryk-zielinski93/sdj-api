import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgCoreRadioApplicationServicesModule } from '@sdj/ng/core/radio/application-services';
import {
  ChannelRepository,
  QueuedTrackRepository
} from '@sdj/ng/core/radio/domain-services';
import {
  ChannelRepositoryAdapter,
  QueuedTrackRepositoryAdapter
} from '@sdj/ng/core/radio/infrastructure';
import { SpeechServiceAdapter } from '@sdj/ng/core/shared/infrastructure-speech';
import { WebSocketClientAdapter } from '@sdj/ng/core/shared/infrastructure-web-socket';
import { SpeechService, WebSocketClient } from '@sdj/ng/core/shared/port';

@NgModule({
  imports: [CommonModule, NgCoreRadioApplicationServicesModule],
  providers: [
    { provide: ChannelRepository, useClass: ChannelRepositoryAdapter },
    { provide: SpeechService, useClass: SpeechServiceAdapter },
    {
      provide: QueuedTrackRepository,
      useClass: QueuedTrackRepositoryAdapter
    },
    { provide: WebSocketClient, useClass: WebSocketClientAdapter }
  ]
})
export class NgCoreRadioShellModule {}
