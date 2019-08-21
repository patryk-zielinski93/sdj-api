import { Inject, Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { ClientProxy } from '@nestjs/microservices';
import { Injectors, MicroservicePattern } from '@sdj/backend/shared';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { PlayDjEvent } from '../play-dj.event';
import { PlayRadioEvent } from '../play-radio.event';

@Injectable()
export class RedisSagas {
  // constructor(
  //   @Inject(Injectors.MicroserviceClient) private readonly client: ClientProxy
  // ) {}

  // @Saga()
  // playDj = (events$: Observable<any>): Observable<ICommand> =>
  //   events$.pipe(
  //     ofType(PlayDjEvent),
  //     tap((event: PlayDjEvent) => 
  //       this.client.emit(MicroservicePattern.playDj, event.channelId).subscribe()
  //     )
  //   );

  // @Saga()
  // playSilence = (events$: Observable<any>): Observable<ICommand> =>
  //   events$.pipe(
  //     ofType(PlayRadioEvent),
  //     tap((event: PlayRadioEvent) =>
  //       this.client.emit(MicroservicePattern.playDj, event.channelId).subscribe()
  //     )
  //   );
}
