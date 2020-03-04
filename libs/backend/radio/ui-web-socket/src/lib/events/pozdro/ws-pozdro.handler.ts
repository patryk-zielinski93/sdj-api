import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PozdroEvent } from '@sdj/backend/radio/core/application-services';
import { LoggerService } from '@sdj/backend/shared/infrastructure-logger';
import { WebSocketEvents } from '@sdj/shared/domain';
import { Gateway } from '../../gateway';

@EventsHandler(PozdroEvent)
export class WsPozdroHandler implements IEventHandler<PozdroEvent> {
  constructor(private logger: LoggerService, private gateway: Gateway) {}

  async handle(event: PozdroEvent): Promise<void> {
    this.gateway.server.in(event.channelId).emit(WebSocketEvents.pozdro, {
      message: event.text
    });
  }
}
