import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Gateway } from '../../../gateway';
import { TellCommand } from '../commands/tell.command';

@CommandHandler(TellCommand)
export class TellHandler implements ICommandHandler<TellCommand> {
    constructor(private readonly gateway: Gateway) {
    }

    async execute(command: TellCommand) {
        this.gateway.server.of('/').emit('pozdro', {
            message: command.message
        });
    }
}
