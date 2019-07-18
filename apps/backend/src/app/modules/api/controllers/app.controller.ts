import { ChannelRepository } from './../../core/modules/db/repositories/channel.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Controller, Get, Param, Render } from '@nestjs/common';
import { HostService } from '../../core/services/host.service';
import { PlaylistService } from '../../core/services/playlist.service';

@Controller()
export class AppController {
  constructor(
    private playlist: PlaylistService,
    @InjectRepository(ChannelRepository)
    private readonly channelRepository: ChannelRepository
  ) {}

  @Get()
  @Render('index.hbs')
  appView(): any {}

  @Get('ices/:id')
  nexSong(@Param() params): any {
    HostService.nextSong(params.id);
  }

  @Get('next/:id')
  async removeNextSong(@Param() params): Promise<any> {
    const channel = await this.channelRepository.findOrCreate(params.id);
    this.playlist.getNext(channel).then(queuedTrack => {
      if (queuedTrack) {
        this.playlist.removeQueuedTrack(queuedTrack);
        return `/tracks/${queuedTrack.track.id}.mp3`;
      } else {
        return '/tracks/10-sec-of-silence.mp3';
      }
    });
  }
}
