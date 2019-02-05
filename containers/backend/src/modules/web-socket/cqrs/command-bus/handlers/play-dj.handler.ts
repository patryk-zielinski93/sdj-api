import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Gateway } from '../../../gateway';
import { PlayDjCommand } from '../commands/play-dj.command';

@CommandHandler(PlayDjCommand)
export class PlayDjHandler implements ICommandHandler<PlayDjCommand> {
    constructor(private readonly gateway: Gateway) {
    }

    async execute(command: PlayDjCommand, resolve: (value?) => void) {
        this.gateway.server.of('/').emit('play_dj');

    }
}
