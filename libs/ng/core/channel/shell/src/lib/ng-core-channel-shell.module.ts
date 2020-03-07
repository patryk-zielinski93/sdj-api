import { NgModule } from '@angular/core';
import { NgCoreChannelApplicationServicesModule } from '@sdj/ng/core/channel/application-services';
import { ChannelRepository } from '@sdj/ng/core/channel/domain-services';
import { ChannelRepositoryAdapter } from '@sdj/ng/core/channel/infrastructure';
import {
  NgCoreSharedInfrastructureSlackModule,
  SlackServiceAdapter
} from '@sdj/ng/core/shared/infrastructure-slack';
import { WebSocketClientAdapter } from '@sdj/ng/core/shared/infrastructure-web-socket';
import { SlackService, WebSocketClient } from '@sdj/ng/core/shared/port';

@NgModule({
  imports: [
    NgCoreChannelApplicationServicesModule,
    NgCoreSharedInfrastructureSlackModule
  ],
  providers: [
    { provide: ChannelRepository, useClass: ChannelRepositoryAdapter },
    { provide: SlackService, useClass: SlackServiceAdapter },
    { provide: WebSocketClient, useClass: WebSocketClientAdapter }
  ]
})
export class NgCoreChannelShellModule {}
