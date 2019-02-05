import { Injectable } from '@nestjs/common';
import { EventObservable, ICommand } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DownloadAndPlayCommand } from '../../command-bus/commands/download-and-play.command';
import { RedisGetNextEvent } from '../redis-get-next.event';

@Injectable()
export class RedisSagas {
    getNext = (events$: EventObservable<any>): Observable<ICommand> =>
        events$.ofType(RedisGetNextEvent)
            .pipe(map((event: RedisGetNextEvent) => new DownloadAndPlayCommand(event.queuedTrack)
            ));
}
