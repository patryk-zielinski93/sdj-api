import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Gateway } from '../../../gateway';
import { PlayRadioCommand } from '../commands/play-radio.command';

@CommandHandler(PlayRadioCommand)
export class PlayRadioHandler implements ICommandHandler<PlayRadioCommand> {
    constructor(private readonly gateway: Gateway) {
    }

    async execute(command: PlayRadioCommand, resolve: (value?) => void) {
        this.gateway.server.of('/').emit('play_dj');

    }
}
