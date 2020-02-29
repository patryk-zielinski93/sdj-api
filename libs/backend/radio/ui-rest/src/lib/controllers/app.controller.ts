import { Controller, Get, Param, Render } from '@nestjs/common';
import {
  ChannelDomainRepository,
  QueuedTrackDomainRepository
} from '@sdj/backend/radio/core/domain-service';
import { HostService } from '@sdj/backend/shared/port';

@Controller()
export class AppController {
  constructor(
    private hostService: HostService,
    private readonly channelRepository: ChannelDomainRepository,
    private queuedTrackRepository: QueuedTrackDomainRepository
  ) {}

  @Get()
  @Render('index.hbs')
  appView(): any {}

  @Get('ices/:id')
  nexSong(@Param() params: { id: string }): Promise<unknown> {
    return this.hostService.nextSong(params.id);
  }

  @Get('next/:id')
  async removeNextSong(@Param() params: { id: string }): Promise<any> {
    const channel = await this.channelRepository.findOrCreate(params.id);
    const queuedTrack = await this.queuedTrackRepository.getNextSongInQueue(
      channel.id
    );
    if (queuedTrack) {
      await this.queuedTrackRepository.remove(queuedTrack);
    }
  }
}