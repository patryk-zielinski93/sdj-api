import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AwesomePlayerComponent } from './components/awesome-player/awesome-player.component';

@NgModule({
  imports: [CommonModule],
  declarations: [AwesomePlayerComponent],
  exports: [AwesomePlayerComponent]
})
export class PlayersModule {}
