import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, zip } from 'rxjs';
import { delay, filter, takeUntil } from 'rxjs/operators';
import { WebSocketService } from './web-socket.service';

@Injectable({
  providedIn: 'root'
})
export class SpeechService {
  speeching = new BehaviorSubject(false);

  private synth: SpeechSynthesis;
  private pozdro$: Subject<MessageEvent>;
  private voice: SpeechSynthesisVoice;

  private lang = 'pl-PL';
  private pitch = 1;
  private rate = 1;

  constructor(private ws: WebSocketService) {
    this.init();
  }

  public init(): void {
    new Promise(resolve => window.speechSynthesis.onvoiceschanged = resolve)
      .then(() => {
        this.synth = window.speechSynthesis;
        this.voice = this.synth.getVoices().find(voice => voice.lang === this.lang);
      });
  }

  public startListening(): void {
    this.pozdro$ = this.ws.createSubject('pozdro');
    const input = this.pozdro$;
    const signal = this.speeching.pipe(filter(speeching => !speeching));
    const output = zip(input, signal, (i, s) => i);
    output.pipe(
      delay(0),
      takeUntil(this.pozdro$)
    )
      .subscribe((data: any) => {
        console.log(data.message);
        this.czytaj(data.message);
      });
  }

  // ToDo implement on logout
  public stopListening(): void {
    this.pozdro$.complete();
  }

  private czytaj(text): void {
    this.speeching.next(true);

    const utterThis = new SpeechSynthesisUtterance(text);
    utterThis.onend = (event) => {
      event.preventDefault();
      this.speeching.next(false);
    };
    utterThis.voice = this.voice;
    utterThis.pitch = this.pitch;
    utterThis.rate = this.rate;
    this.synth.speak(utterThis);
  }
}
