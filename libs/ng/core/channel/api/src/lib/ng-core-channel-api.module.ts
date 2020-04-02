import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ChannelApiFacade } from './channel-api.facade';

@NgModule({
  imports: [CommonModule],
  providers: [ChannelApiFacade]
})
export class NgCoreChannelApiModule {}
