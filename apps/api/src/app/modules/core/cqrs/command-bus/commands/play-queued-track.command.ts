import { ICommand } from '@nestjs/cqrs';

export class PlayQueuedTrackCommand implements ICommand {
    constructor(public queuedTrackId: number) {
    }
}
