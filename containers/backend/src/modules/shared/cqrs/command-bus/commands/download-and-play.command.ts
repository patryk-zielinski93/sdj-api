import { ICommand } from '@nestjs/cqrs';
import { QueuedTrack } from '../../../modules/db/entities/queued-track.model';

export class DownloadAndPlayCommand implements ICommand {
    constructor(public queuedTrack: QueuedTrack) {
    }

}