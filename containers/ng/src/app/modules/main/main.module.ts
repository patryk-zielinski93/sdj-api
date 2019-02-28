import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AwesomePlayerComponent } from './components/awsome-player/awesome-player.component';
import { MiniPlayerComponent } from './components/navbar/mini-player/mini-player.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { UserProfileComponent } from './components/navbar/user-profile/user-profile.component';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';

@NgModule({
  declarations: [
    NavbarComponent,
    MainComponent,
    MiniPlayerComponent,
    UserProfileComponent,
    AwesomePlayerComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule
  ],
  exports: [
    AwesomePlayerComponent
  ]
})
export class MainModule {}
