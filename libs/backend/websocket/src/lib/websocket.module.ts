import { Module } from '@nestjs/common';

import { PlayDjHandler } from './cqrs/command-bus/handlers/play-dj.handler';
import { PlayRadioHandler } from './cqrs/command-bus/handlers/play-radio.handler';
import { TellHandler } from './cqrs/events/handlers/tell.handler';
import { Gateway } from './gateway';

export const CommandHandlers = [TellHandler];
export const EventHandlers = [PlayDjHandler, PlayRadioHandler];

@Module({
  providers: [...CommandHandlers, ...EventHandlers, Gateway],
  exports: [Gateway]
})
export class WebSocketModule {}
