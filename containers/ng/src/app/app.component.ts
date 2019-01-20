import { AfterViewInit, Component } from '@angular/core';
import { WebSocketService } from '../web-socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'sdj';
  synth: SpeechSynthesis;
  dj: HTMLAudioElement;
  open: HTMLAudioElement;
  inputForm;
  inputTxt;
  voiceSelect;
  pitch;
  pitchValue;
  rate;
  rateValue;
  voices = [];
  timeout;
  speeching = false;

  constructor(private ws: WebSocketService) {

  }

  ngAfterViewInit(): void {
    this.synth = window.speechSynthesis;

    this.dj = <HTMLAudioElement>document.getElementById('dj');
    this.open = <HTMLAudioElement>document.getElementById('open');

    this.inputForm = document.querySelector('form');
    this.inputTxt = document.querySelector('.txt');
    this.voiceSelect = document.querySelector('select');

    this.pitch = document.querySelector('#pitch');
    this.pitchValue = document.querySelector('.pitch-value');
    this.rate = document.querySelector('#rate');
    this.rateValue = document.querySelector('.rate-value');

    const awaitVoices = new Promise(resolve =>
      window.speechSynthesis.onvoiceschanged = resolve)
      .then(() => {
        this.synth = window.speechSynthesis;
        this.populateVoiceList();
        speechSynthesis.onvoiceschanged = this.populateVoiceList;
      });

    this.inputForm.onsubmit = (event) => {
      event.preventDefault();

      const utterThis = new SpeechSynthesisUtterance(this.inputTxt.value);
      const selectedOption = this.voiceSelect.selectedOptions[0].getAttribute('data-name');
      for (let i = 0; i < this.voices.length; i++) {
        if (this.voices[i].name === selectedOption) {
          utterThis.voice = this.voices[i];
        }
      }
      utterThis.pitch = this.pitch.value;
      utterThis.rate = this.rate.value;
      this.synth.speak(utterThis);

      utterThis.onpause = function(event) {
        const char = event.utterance.text.charAt(event.charIndex);
        console.log('Speech paused at character ' + event.charIndex + ' of "' +
          event.utterance.text + '", which is "' + char + '".');
      };

      this.inputTxt.blur();
    };

    this.pitch.onchange = () => {
      this.pitchValue.textContent = this.pitch.value;
    };

    this.rate.onchange = () => {
      this.rateValue.textContent = this.rate.value;
    };

    const connect$ = this.ws.createSubject('connect');
    const events$ = this.ws.createSubject('events');
    connect$.subscribe(() => {
      console.log('Connected');
      events$.next(<any>{ test: 'test' });
    });
    events$.subscribe((data) => console.log('event', data));
    const disconnect$ = this.ws.createSubject('disconnect');
    disconnect$.subscribe(() => console.log('Disconnected'));
    const exception$ = this.ws.createSubject('exception');
    exception$.subscribe(() => console.log('Disconnected'));

    const pozdro = this.ws.createSubject('pozdro');
    pozdro.subscribe((data: any) => {
      console.log(data.message);
      this.czytaj(data.message);
    });
    const playDJ$ = this.ws.createSubject('play_dj');
    playDJ$.subscribe((data) => {
      console.log('playDj');
      this.open.pause();
      if (this.dj.paused) {
        this.dj.load();
      }
      this.dj.play();
    });
    const playRadio$ = this.ws.createSubject('play_radio');
    playRadio$.subscribe(() => {
      this.dj.pause();
      if (this.open.paused) {
        this.open.load();
      }
      this.open.play();
    });
  }

  czytaj(text) {
    if (this.dj.paused || this.speeching) {
      return;
    }

    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.speeching = true;
    this.dj.volume = 0.1;

    const utterThis = new SpeechSynthesisUtterance(text);
    utterThis.onend = (event) => {
      event.preventDefault();
      this.dj.volume = 1;
      this.speeching = false;
    };
    const selectedOption = this.voiceSelect.selectedOptions[0].getAttribute('data-name');
    for (let i = 0; i < this.voices.length; i++) {
      if (this.voices[i].name === selectedOption) {
        utterThis.voice = this.voices[i];
      }
    }
    utterThis.pitch = this.pitch.value;
    utterThis.rate = this.rate.value;
    this.synth.speak(utterThis);

    this.timeout = setTimeout(() => {
      this.dj.volume = 1;
    }, 20000);
  }

  populateVoiceList() {
    this.voices = this.synth.getVoices();
    const selectedIndex = this.voiceSelect.selectedIndex < 0 ? 0 : this.voiceSelect.selectedIndex;
    this.voiceSelect.innerHTML = '';
    for (let i = 0; i < this.voices.length; i++) {
      let option = document.createElement('option');
      option.textContent = this.voices[i].name + ' (' + this.voices[i].lang + ')';

      if (this.voices[i].default) {
        option.textContent += ' -- DEFAULT';
      }

      option.setAttribute('data-lang', this.voices[i].lang);
      option.setAttribute('data-name', this.voices[i].name);
      this.voiceSelect.appendChild(option);
    }
    this.voiceSelect.selectedIndex = selectedIndex;
  }
}
