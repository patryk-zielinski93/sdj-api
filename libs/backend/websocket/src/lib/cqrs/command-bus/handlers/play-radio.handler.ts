import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Gateway } from '../../../gateway';
import { PlayRadioEvent } from '@sdj/backend/core';
import { LoggerService } from '@sdj/backend/common';
import { WebSocketEvents } from '@sdj/shared/common';

@EventsHandler(PlayRadioEvent)
export class PlayRadioHandler implements IEventHandler<PlayRadioEvent> {
  constructor(
    private readonly gateway: Gateway,
    private readonly logger: LoggerService
  ) {}

  handle(event: PlayRadioEvent): void {
    this.logger.log('radio', event.channelId);
    this.gateway.server.in(event.channelId).emit(WebSocketEvents.playRadio);
  }
}
