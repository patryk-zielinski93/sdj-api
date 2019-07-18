import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TellEvent } from '@sdj/backend/core';

import { Gateway } from '../../../gateway';

@EventsHandler(TellEvent)
export class TellHandler implements IEventHandler<TellEvent> {
  constructor(private readonly gateway: Gateway) {}

  async handle(command: TellEvent) {
    this.gateway.server.of('/').emit('pozdro', {
      message: command.message
    });
  }
}
