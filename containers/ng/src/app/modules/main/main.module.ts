import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { UserProfileComponent } from './navbar/user-profile/user-profile.component';
import { MiniPlayerComponent } from './navbar/mini-player/mini-player.component';

@NgModule({
  declarations: [
    NavbarComponent,
    MainComponent,
    MiniPlayerComponent,
    UserProfileComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule
  ]
})
export class MainModule { }
