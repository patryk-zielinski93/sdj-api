import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgCoreTrackShellModule } from '@sdj/ng/core/track/shell';
import { NgSharedUiSdjLoaderModule } from '@sdj/ng/presentation/shared/presentation-sdj-loader';
import { NgxAudioPlayerModule } from 'ngx-audio-player';
import { MostPlayedComponent } from './containers/most-played/most-played.component';

@NgModule({
  imports: [
    CommonModule,
    NgCoreTrackShellModule,
    RouterModule.forChild([{ path: '', component: MostPlayedComponent }]),
    NgxAudioPlayerModule,
    NgSharedUiSdjLoaderModule
  ],
  declarations: [MostPlayedComponent]
})
export class NgMostPlayedFeatureModule {}
