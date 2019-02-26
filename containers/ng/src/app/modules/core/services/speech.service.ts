import { Injectable } from '@angular/core';
import { WebSocketService } from './web-socket.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpeechService {
  private speeching = false;
  private synth: SpeechSynthesis;
  private timeout: number;
  private pozdro$: Subject<MessageEvent>;
  private voice: SpeechSynthesisVoice;

  private lang = 'pl-PL';
  private pitch = 1;
  private rate = 1;

  constructor(private ws: WebSocketService) {}

  public init(): void {
    new Promise(resolve => window.speechSynthesis.onvoiceschanged = resolve)
      .then(() => {
        this.synth = window.speechSynthesis;
        this.voice = this.synth.getVoices().find(voice => voice.lang === this.lang);
      });
  }

  public startListening(): void {
    this.pozdro$ = this.ws.createSubject('pozdro');
    this.pozdro$.subscribe((data: any) => {
        console.log(data.message);
        // this.czytaj(data.message);
      });
  }

  public stopListening(): void {
    this.pozdro$.complete();
  }

  // private czytaj(text): void {
  //   if (this.speeching) {
  //     return;
  //   }
  //
  //   if (this.timeout) {
  //     clearTimeout(this.timeout);
  //   }
  //
  //   this.speeching = true;
  //   this.dj.volume = 0.1;
  //
  //   const utterThis = new SpeechSynthesisUtterance(text);
  //   utterThis.onend = (event) => {
  //     event.preventDefault();
  //     this.dj.volume = 1;
  //     this.speeching = false;
  //   };
  //   const selectedOption = this.voiceSelect.selectedOptions[0].getAttribute('data-name');
  //   for (let i = 0; i < this.voices.length; i++) {
  //     if (this.voices[i].name === selectedOption) {
  //       utterThis.voice = this.voices[i];
  //     }
  //   }
  //   utterThis.pitch = this.pitch.value;
  //   utterThis.rate = this.rate.value;
  //   this.synth.speak(utterThis);
  //
  //   this.timeout = setTimeout(() => {
  //     this.dj.volume = 1;
  //     this.speeching = false;
  //   }, 20000);
  // }
}
