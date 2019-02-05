import { IEvent } from '@nestjs/cqrs';
import { QueuedTrack } from '../../modules/db/entities/queued-track.model';

export class RedisGetNextEvent implements IEvent {
    constructor(public queuedTrack: QueuedTrack) {
    }
}
