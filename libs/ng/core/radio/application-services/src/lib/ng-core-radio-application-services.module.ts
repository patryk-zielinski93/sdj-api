import { NgModule } from '@angular/core';
import { QueuedTrackFacade } from './queued-track.facade';
import { RadioFacade } from './radio.facade';
import { TrackFacade } from './track.facade';

@NgModule({
  providers: [QueuedTrackFacade, RadioFacade, TrackFacade]
})
export class NgCoreRadioApplicationServicesModule {}
