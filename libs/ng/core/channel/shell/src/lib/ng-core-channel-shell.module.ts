import { NgModule } from '@angular/core';
import { NgCoreChannelApplicationServicesModule } from '@sdj/ng/core/channel/application-services';
import { ChannelRepository } from '@sdj/ng/core/channel/domain-services';
import { ChannelRepositoryAdapter } from '@sdj/ng/core/channel/infrastructure';
import {
  NgCoreSharedInfrastructureSlackModule,
  SlackServiceAdapter
} from '@sdj/ng/core/shared/infrastructure-slack';
import { SlackService, WebSocketClient } from '@sdj/ng/core/shared/port';
import { NgCoreSharedInfrastructureWebSocketModule } from '@sdj/ng/core/shared/infrastructure-web-socket';

@NgModule({
  imports: [
    NgCoreChannelApplicationServicesModule,
    NgCoreSharedInfrastructureSlackModule,
    NgCoreSharedInfrastructureWebSocketModule
  ],
  providers: [
    { provide: ChannelRepository, useClass: ChannelRepositoryAdapter },
    { provide: SlackService, useExisting: SlackServiceAdapter }
  ]
})
export class NgCoreChannelShellModule {}
