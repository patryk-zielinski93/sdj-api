import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ChannelUpdatedEvent } from '@sdj/backend/radio/core/domain';
import { ChannelListEmitter } from '../../gateway/channel-list.emitter';

@EventsHandler(ChannelUpdatedEvent)
export class WsChannelUpdatedHandler
  implements IEventHandler<ChannelUpdatedEvent> {
  constructor(private channelListEmitter: ChannelListEmitter) {}

  async handle(event: ChannelUpdatedEvent): Promise<void> {
    await this.channelListEmitter.emitChannelList();
  }
}
