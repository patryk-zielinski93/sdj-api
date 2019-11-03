import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NgxAudioPlayerModule } from "ngx-audio-player";
import { MostPlayedComponent } from "./containers/most-played/most-played.component";

@NgModule({
  imports: [
    CommonModule,

    RouterModule.forChild([{ path: '', component: MostPlayedComponent }]),
    NgxAudioPlayerModule
  ],
  declarations: [MostPlayedComponent]
})
export class NgMostPlayedFeatureModule {}
