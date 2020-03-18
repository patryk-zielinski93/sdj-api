import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ChannelStartedEvent } from '@sdj/backend/radio/core/domain';
import { ChannelDomainRepository } from '@sdj/backend/radio/core/domain-service';
import { WebSocketEvents } from '@sdj/shared/domain';
import { Gateway } from '../../gateway/gateway';

@EventsHandler(ChannelStartedEvent)
export class WsChannelStartedHandler
  implements IEventHandler<ChannelStartedEvent> {
  constructor(
    private channelRepository: ChannelDomainRepository,
    private gateway: Gateway
  ) {}

  async handle(event: ChannelStartedEvent): Promise<void> {
    const channel = await this.channelRepository.findOrFail(event.channelId);
    this.gateway.server.in(channel.id).emit(WebSocketEvents.roomIsRunning);
  }
}
