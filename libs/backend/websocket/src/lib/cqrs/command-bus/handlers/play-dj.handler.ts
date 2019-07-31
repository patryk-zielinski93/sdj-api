import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Gateway } from '../../../gateway';
import { PlayDjEvent } from '@sdj/backend/core';
import { LoggerService } from '@sdj/backend/logger';

@EventsHandler(PlayDjEvent)
export class PlayDjHandler implements IEventHandler<PlayDjEvent> {
  constructor(
    private readonly gateway: Gateway,
    private readonly logger: LoggerService
  ) {}

  handle(event: PlayDjEvent): any {
    this.logger.log('dj', event.channelId);
    this.gateway.server.in(event.channelId).emit('play_dj');
  }
}
