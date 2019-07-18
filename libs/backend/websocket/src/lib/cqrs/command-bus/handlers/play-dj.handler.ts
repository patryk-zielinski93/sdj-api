import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Gateway } from '../../../gateway';
import { PlayDjEvent } from '@sdj/backend/core';

@EventsHandler(PlayDjEvent)
export class PlayDjHandler implements IEventHandler<PlayDjEvent> {
  constructor(private readonly gateway: Gateway) {}

  handle(event: PlayDjEvent): any {
    console.log(event.channelId, 'dj');
    this.gateway.server.in(event.channelId).emit('play_dj');
  }
}
