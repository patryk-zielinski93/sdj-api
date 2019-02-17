import { ICommand } from '@nestjs/cqrs';
import { QueuedTrack } from '../../../modules/db/entities/queued-track.model';

export class PlayQueuedTrackCommand implements ICommand {
    constructor(public queuedTrack: QueuedTrack) {
    }
}