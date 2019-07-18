import { ICommand } from '@nestjs/cqrs';
import { QueuedTrack } from '../../../modules/db/entities/queued-track.entity';

export class DownloadAndPlayCommand implements ICommand {
    constructor(public queuedTrack: QueuedTrack) {
    }

}
