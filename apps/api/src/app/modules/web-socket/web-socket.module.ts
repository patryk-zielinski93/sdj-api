import { Module, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { PlayDjHandler } from './cqrs/command-bus/handlers/play-dj.handler';
import { PlayRadioHandler } from './cqrs/command-bus/handlers/play-radio.handler';
import { TellHandler } from './cqrs/command-bus/handlers/tell.handler';
import { Gateway } from './gateway';

export const CommandHandlers = [TellHandler];
export const EventHandlers = [PlayDjHandler, PlayRadioHandler];

@Module({
    providers: [
        ...CommandHandlers,
        ...EventHandlers,
        Gateway
    ],
    exports: [Gateway]
})
export class WebSocketModule {
}
