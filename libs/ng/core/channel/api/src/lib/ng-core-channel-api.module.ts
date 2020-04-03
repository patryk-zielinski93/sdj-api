import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgCoreChannelApplicationServicesModule } from '@sdj/ng/core/channel/application-services';
import { ChannelApiFacade } from './channel-api.facade';

@NgModule({
  imports: [CommonModule, NgCoreChannelApplicationServicesModule],
  providers: [ChannelApiFacade]
})
export class NgCoreChannelApiModule {}
