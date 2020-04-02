import { Injectable } from '@angular/core';
import { Channel, ChannelApiFacade } from '@sdj/ng/core/channel/api';
import { environment } from '@sdj/ng/core/shared/domain';
import { SpeechService, WebSocketClient } from '@sdj/ng/core/shared/port';
import { WebSocketEvents } from '@sdj/shared/domain';
import { BehaviorSubject, Observable, Subject, Subscription, zip } from 'rxjs';
import { delay, filter, map, skip } from 'rxjs/operators';
import { JoinHandler } from './commands/join/join.handler';
import { ExternalRadioFacade } from './external-radio.facade';
import { GetAudioSourceHandler } from './queries/get-audio-source.handler';
import { GetAudioSourceQuery } from './queries/get-audio-source.query';

@Injectable()
export class RadioFacade {
  audioSource$ = new BehaviorSubject(environment.externalStream);
  roomIsRunning$ = new BehaviorSubject(false);
  playDj$ = this.ws.observe(WebSocketEvents.playDj);
  playRadio$ = this.ws.observe(WebSocketEvents.playRadio);
  speeching$: Observable<boolean> = this.speechService.speeching$;

  private getAudioSourceSub: Subscription;
  private pozdro$: Subject<{ message: string }>;

  constructor(
    private channelFacade: ChannelApiFacade,
    private joinHandler: JoinHandler,
    private externalRadioFacade: ExternalRadioFacade,
    private getAudioSourceHandler: GetAudioSourceHandler,
    private speechService: SpeechService,
    private ws: WebSocketClient
  ) {
    this.listenForRoomIsRunning();
    this.onSelectedExternalRadioChange();
  }

  join(channel: Channel): void {
    this.roomIsRunning$.next(false);
    this.joinHandler.execute({ channelId: channel.id });
    this.getAudioSource();
  }

  leaveChannel(channel: Channel): void {
    this.ws.emit(WebSocketEvents.leaveChannel, channel.id);
  }

  startListeningForPozdro(): void {
    this.pozdro$ = this.ws.createSubject(WebSocketEvents.pozdro);
    const input = this.pozdro$;
    const signal = this.speeching$.pipe(filter(speeching => !speeching));
    const output = zip(input, signal);
    output
      .pipe(
        map(([i, s]) => i),
        delay(0)
      )
      .subscribe((data: any) => {
        this.speechService.speak(data.message);
      });
  }

  stopListeningForPozdro(): void {
    this.pozdro$.complete();
  }

  private getAudioSource(): void {
    if (this.getAudioSourceSub) {
      this.getAudioSourceSub.unsubscribe();
    }
    this.getAudioSourceSub = this.getAudioSourceHandler
      .exec(
        new GetAudioSourceQuery(
          this.channelFacade.selectedChannel$.value,
          this.roomIsRunning$,
          this.playDj$,
          this.playRadio$,
          this.externalRadioFacade.selectedExternalRadio$.value
        )
      )
      .subscribe(value => this.audioSource$.next(value));
  }

  private listenForRoomIsRunning(): void {
    this.ws
      .observe<void>(WebSocketEvents.roomIsRunning)
      .subscribe(() => this.roomIsRunning$.next(true));
  }

  private onSelectedExternalRadioChange(): void {
    this.externalRadioFacade.selectedExternalRadio$
      .pipe(skip(1))
      .subscribe(() => {
        this.getAudioSource();
      });
  }
}
