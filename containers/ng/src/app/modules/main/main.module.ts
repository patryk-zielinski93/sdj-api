import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { UserProfileComponent } from './menu/user-profile/user-profile.component';
import { MiniPlayerComponent } from './menu/mini-player/mini-player.component';

@NgModule({
  declarations: [
    MenuComponent,
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
