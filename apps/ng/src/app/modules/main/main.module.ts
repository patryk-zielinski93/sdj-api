import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AwesomePlayerComponent } from './components/awesome-player/awesome-player.component';
import { MiniPlayerComponent } from './components/navbar/mini-player/mini-player.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { UserProfileComponent } from './components/navbar/user-profile/user-profile.component';
import { MostPlayedTracksResolver } from './components/views/most-played-view/most-played-tracks.resolver';
import { MostPlayedViewComponent } from './components/views/most-played-view/most-played-view.component';
import { RadioViewComponent } from './components/views/radio-view/radio-view.component';
import { MainComponent } from './main.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    AwesomePlayerComponent,
    MainComponent,
    MiniPlayerComponent,
    MostPlayedViewComponent,
    NavbarComponent,
    RadioViewComponent,
    UserProfileComponent],
  providers: [MostPlayedTracksResolver]
})
export class MainModule {

}
