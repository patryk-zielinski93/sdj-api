import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisSagas {
  // getNext = (events$: EventObservable<any>): Observable<ICommand> =>
  //     events$.ofType(RedisGetNextEvent)
  //         .pipe(map((event: RedisGetNextEvent) => new DownloadAndPlayCommand(event.queuedTrack)
  //         ));
}
