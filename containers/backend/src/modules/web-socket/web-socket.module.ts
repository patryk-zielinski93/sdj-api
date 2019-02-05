import { Module, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CommandBus } from '@nestjs/cqrs';
import { SharedModule } from '../shared/shared.module';
import { PlayDjHandler } from './cqrs/command-bus/handlers/play-dj.handler';
import { PlayRadioHandler } from './cqrs/command-bus/handlers/play-radio.handler';
import { TellHandler } from './cqrs/command-bus/handlers/tell.handler';
import { Gateway } from './gateway';

export const CommandHandlers = [PlayDjHandler, PlayRadioHandler, TellHandler];

@Module({
    imports: [SharedModule],
    providers: [
        ...CommandHandlers,
        Gateway
    ],
    exports: [Gateway]
})
export class WebSocketModule implements OnModuleInit {
    constructor(private readonly moduleRef: ModuleRef, private readonly command$: CommandBus) {
    }

    onModuleInit(): any {
        this.command$.setModuleRef(this.moduleRef);

        this.command$.register(CommandHandlers);
    }
}