import { Injectable } from '@nestjs/common';

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
