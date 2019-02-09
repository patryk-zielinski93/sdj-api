import { Module, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { SharedModule } from '../shared/shared.module';
import { PlayDjHandler } from './cqrs/command-bus/handlers/play-dj.handler';
import { PlayRadioHandler } from './cqrs/command-bus/handlers/play-radio.handler';
import { TellHandler } from './cqrs/command-bus/handlers/tell.handler';
import { Gateway } from './gateway';

export const CommandHandlers = [TellHandler];
export const EventHandlers = [PlayDjHandler, PlayRadioHandler];

@Module({
    imports: [SharedModule],
    providers: [
        ...CommandHandlers,
        ...EventHandlers,
        Gateway
    ],
    exports: [Gateway]
})
export class WebSocketModule implements OnModuleInit {
    constructor(private readonly moduleRef: ModuleRef, private readonly command$: CommandBus, private readonly eventBus$: EventBus) {
    }

    onModuleInit(): any {
        this.command$.setModuleRef(this.moduleRef);
        this.eventBus$.setModuleRef(this.moduleRef);

        this.command$.register(CommandHandlers);
        this.eventBus$.register(EventHandlers);
    }
}
