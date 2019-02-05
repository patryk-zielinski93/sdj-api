import { ICommand } from '@nestjs/cqrs';
import { QueuedTrack } from '../../../modules/db/entities/queued-track.model';

export class SetNextSongCommand implements ICommand {
    constructor(public queuedTrack: QueuedTrack) {
    }
}