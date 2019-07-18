import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PlaylistService } from '../../../services/playlist.service';
import { PlaylistStore } from '../../../store/playlist.store';
import { DownloadAndPlayCommand } from '../../command-bus/commands/download-and-play.command';
import { PlaySilenceCommand } from '../../command-bus/commands/play-silence.command';
import { RedisGetNextEvent } from '../redis-get-next.event';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelRepository } from '../../../modules/db/repositories/channel.repository';
import { QueuedTrack } from '../../../modules/db/entities/queued-track.entity';

@EventsHandler(RedisGetNextEvent)
export class RedisGetNextHandler implements IEventHandler<RedisGetNextEvent> {
  constructor(
    private readonly commandBus: CommandBus,
    private playlist: PlaylistService,
    @InjectRepository(ChannelRepository)
    private channelRepository: ChannelRepository
  ) {}

  async handle(event: RedisGetNextEvent): Promise<any> {
    const channel = await this.channelRepository.findOrCreate(event.channelId);
    this.playlist
      .getNext(channel)
      .then(async (queuedTrack: QueuedTrack | undefined) => {
        if (queuedTrack) {
          this.commandBus.execute(new DownloadAndPlayCommand(queuedTrack));
        } else {
          this.commandBus.execute(new PlaySilenceCommand(channel.id));
        }
      });
  }
}
