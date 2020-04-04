import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CHANNEL_FEATURE_KEY, reducer } from './+state/channel.reducer';
import { LoadChannelsHandler } from './queries/load-channels/load-channels.handler';

const HANDLERS = [LoadChannelsHandler];

@NgModule({
  imports: [
    EffectsModule.forFeature(HANDLERS),
    StoreModule.forFeature(CHANNEL_FEATURE_KEY, reducer)
  ]
})
export class NgCoreChannelApplicationServicesModule {}
