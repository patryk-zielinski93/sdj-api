import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgCoreChannelApiModule } from '@sdj/ng/core/channel/api';
import * as fromRadio from './+state/radio.reducer';
import { JoinHandler } from './commands/join/join.handler';
import { ExternalRadioFacade } from './external-radio.facade';
import { GetAudioSourceHandler } from './queries/get-audio-source.handler';
import { QueuedTrackFacade } from './queued-track.facade';
import { RadioFacade } from './radio.facade';
import { TrackFacade } from './track.facade';

const HANDLERS = [JoinHandler, GetAudioSourceHandler];

@NgModule({
  providers: [ExternalRadioFacade, QueuedTrackFacade, RadioFacade, TrackFacade],
  imports: [
    EffectsModule.forFeature(HANDLERS),
    NgCoreChannelApiModule,
    StoreModule.forFeature(fromRadio.RADIO_FEATURE_KEY, fromRadio.reducer)
  ]
})
export class NgCoreRadioApplicationServicesModule {}
