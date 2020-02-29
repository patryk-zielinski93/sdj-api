import {
  CommandBus,
  EventBus,
  EventsHandler,
  IEventHandler
} from '@nestjs/cqrs';
import { PlaySilenceEvent } from '@sdj/backend/radio/core/application-services';
import { QueuedTrack } from '@sdj/backend/radio/core/domain';
import { ChannelDomainRepository } from '@sdj/backend/radio/core/domain-service';
import { PlaylistService } from '../../../../../../radio/core/application-services/src/lib/playlist.service';

import { DownloadAndPlayCommand } from '../../command-bus/commands/download-and-play.command';
import { RedisGetNextEvent } from './redis-get-next.event';

@EventsHandler(RedisGetNextEvent)
export class RedisGetNextHandler implements IEventHandler<RedisGetNextEvent> {
  constructor(
    private readonly commandBus: CommandBus,
    private eventBus: EventBus,
    private playlist: PlaylistService,
    private channelRepository: ChannelDomainRepository
  ) {}

  async handle(event: RedisGetNextEvent): Promise<any> {
    const channel = await this.channelRepository.findOrCreate(event.channelId);
    this.playlist
      .getNext(channel)
      .then(async (queuedTrack: QueuedTrack | undefined) => {
        if (queuedTrack) {
          this.commandBus.execute(new DownloadAndPlayCommand(queuedTrack));
        } else {
          this.eventBus.publish(new PlaySilenceEvent(channel.id));
        }
      });
  }
}
