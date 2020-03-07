import { NgModule } from '@angular/core';
import { NgCoreChannelApplicationServicesModule } from '@sdj/ng/core/channel/application-services';
import { ChannelRepository } from '@sdj/ng/core/radio/domain-services';
import { ChannelRepositoryAdapter } from '@sdj/ng/core/radio/infrastructure';
import { WebSocketClientAdapter } from '@sdj/ng/core/shared/infrastructure-web-socket';
import { WebSocketClient } from '@sdj/ng/core/shared/port';

@NgModule({
  imports: [NgCoreChannelApplicationServicesModule],
  providers: [
    { provide: ChannelRepository, useClass: ChannelRepositoryAdapter },
    { provide: WebSocketClient, useClass: WebSocketClientAdapter }
  ]
})
export class NgCoreChannelShellModule {}
