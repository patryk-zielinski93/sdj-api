import { NgModule } from '@angular/core';
import { ExternalRadioFacade } from './external-radio.facade';
import { QueuedTrackFacade } from './queued-track.facade';
import { RadioFacade } from './radio.facade';
import { TrackFacade } from './track.facade';

@NgModule({
  providers: [ExternalRadioFacade, QueuedTrackFacade, RadioFacade, TrackFacade]
})
export class NgCoreRadioApplicationServicesModule {}
