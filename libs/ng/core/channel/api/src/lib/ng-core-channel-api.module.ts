import { NgModule } from '@angular/core';
import { NgCoreChannelApplicationServicesModule } from '@sdj/ng/core/channel/application-services';
import { ChannelApiFacade } from './channel-api.facade';

@NgModule({
  imports: [NgCoreChannelApplicationServicesModule],
  providers: [ChannelApiFacade]
})
export class NgCoreChannelApiModule {}
