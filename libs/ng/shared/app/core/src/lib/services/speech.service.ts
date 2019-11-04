import { Injectable } from '@angular/core';
import { WebSocketEvents } from '@sdj/shared/domain';
import { BehaviorSubject, Subject, zip } from 'rxjs';
import { delay, filter, map } from 'rxjs/operators';
import { WebSocketService } from './web-socket.service';

@Injectable({
  providedIn: 'root'
})
export class SpeechService {
  speeching: Subject<boolean> = new BehaviorSubject(false);

  private synth: SpeechSynthesis;
  private pozdro$: Subject<MessageEvent>;
  private voice: SpeechSynthesisVoice;

  private lang: string = 'pl-PL';
  private pitch: number = 1;
  private rate: number = 1;

  constructor(private ws: WebSocketService) {
    this.init();
  }

  public init(): void {
    new Promise(
      resolve => (window.speechSynthesis.onvoiceschanged = resolve)
    ).then(() => {
      this.synth = window.speechSynthesis;
      this.voice = this.synth
        .getVoices()
        .find(voice => voice.lang === this.lang);
    });
  }

  public startListening(): void {
    this.pozdro$ = this.ws.createSubject(WebSocketEvents.pozdro);
    const input = this.pozdro$;
    const signal = this.speeching.pipe(filter(speeching => !speeching));
    const output = zip(input, signal);
    output
      .pipe(
        map(([i, s]) => i),
        delay(0)
      )
      .subscribe((data: any) => {
        console.log(data.message);
        this.speak(data.message);
      });
  }

  // ToDo implement on logout
  public stopListening(): void {
    this.pozdro$.complete();
  }

  private speak(text: string): void {
    this.speeching.next(true);

    const utterThis = new SpeechSynthesisUtterance(text);
    utterThis.onend = event => {
      event.preventDefault();
      this.speeching.next(false);
    };
    utterThis.voice = this.voice;
    utterThis.pitch = this.pitch;
    utterThis.rate = this.rate;
    this.synth.speak(utterThis);
  }
}
