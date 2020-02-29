import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { LoggerService } from '@sdj/backend/shared/logger';
import { WebSocketEvents } from '@sdj/shared/domain';
import { PozdroEvent } from '../../../../../core/application-services/src/lib/events/pozdro/pozdro.event';
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
