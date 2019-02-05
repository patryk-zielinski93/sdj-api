import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { QueuedTrack } from '../modules/db/entities/queued-track.model';

@Injectable()
export class WebSocketService {
    public playDj = new Subject<QueuedTrack>();
    public playRadio = new Subject<void>();
    public pozdro = new Subject<string>();

}
