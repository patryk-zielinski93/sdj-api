import { ICommand } from '@nestjs/cqrs';
import { QueuedTrack } from '../../../modules/db/entities/queued-track.entity';

export class PlayQueuedTrackCommand implements ICommand {
    constructor(public queuedTrackId: number) {
    }
}