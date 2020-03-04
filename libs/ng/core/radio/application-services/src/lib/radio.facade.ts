import { Injectable } from '@angular/core';
import { SpeechService, WebSocketClient } from '@sdj/ng/core/shared/port';
import { WebSocketEvents } from '@sdj/shared/domain';
import { Observable, Subject, zip } from 'rxjs';
import { delay, filter, map } from 'rxjs/operators';

@Injectable()
export class RadioFacade {
  speeching$: Observable<boolean> = this.speechService.speeching$;

  private pozdro$: Subject<{ message: string }>;

  constructor(
    private speechService: SpeechService,
    private ws: WebSocketClient
  ) {}

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
}
