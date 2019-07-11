import { Controller, Get, Param, Render } from '@nestjs/common';
import { Channel } from '../../core/modules/db/entities/channel.entity';
import { HostService } from '../../core/services/host.service';
import { PlaylistService } from '../../core/services/playlist.service';

@Controller()
export class AppController {
  constructor(private playlist: PlaylistService) {
  }

  @Get()
  @Render('index.hbs')
  appView(): any {
  }

  @Get('ices/:id')
  nexSong(@Param() params): any {
    HostService.nextSong(params.id);
  }

  @Get('next')
  removeNextSong(): any {
      this.playlist.getNext({} as Channel)
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
