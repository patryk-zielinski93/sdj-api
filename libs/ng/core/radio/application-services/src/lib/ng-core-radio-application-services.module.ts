import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ChannelFacade } from './channel.facade';
import { QueuedTrackFacade } from './queued-track.facade';
import { RadioFacade } from './radio.facade';

@NgModule({
  imports: [CommonModule],
  providers: [ChannelFacade, QueuedTrackFacade, RadioFacade]
})
export class NgCoreRadioApplicationServicesModule {}
