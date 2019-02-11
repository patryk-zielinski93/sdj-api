import { Controller, Get, Render } from '@nestjs/common';
import { IcesService } from '../../core/services/ices.service';
import { PlaylistService } from '../../core/services/playlist.service';

@Controller()
export class AppController {
  constructor(private playlist: PlaylistService) {
  }

  @Get()
  @Render('index.hbs')
  appView(): any {
  }

  @Get('ices')
  nexSong(): any {
    IcesService.nextSong();
  }

  @Get('next')
  removeNextSong(): any {
    this.playlist.getNext()
      .then(queuedTrack => {
      if (queuedTrack) {
        this.playlist.removeQueuedTrack(queuedTrack);
        return `/tracks/${queuedTrack.track.id}.mp3`;
      } else {
        return '/tracks/10-sec-of-silence.mp3';
      }
    });
  }
}
