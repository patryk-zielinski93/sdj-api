import { NgModule } from '@angular/core';
import { QueuedTrackFacade } from './queued-track.facade';
import { RadioFacade } from './radio.facade';

@NgModule({
  providers: [QueuedTrackFacade, RadioFacade]
})
export class NgCoreRadioApplicationServicesModule {}
