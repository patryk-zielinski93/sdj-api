import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Gateway } from '../../../gateway';
import { PlayRadioEvent } from '@sdj/backend/core';

@EventsHandler(PlayRadioEvent)
export class PlayRadioHandler implements IEventHandler<PlayRadioEvent> {
  constructor(private readonly gateway: Gateway) {}

  handle(event: PlayRadioEvent): void {
    console.log(event.channelId, 'radio');
    this.gateway.server.in(event.channelId).emit('play_radio');
  }
}
