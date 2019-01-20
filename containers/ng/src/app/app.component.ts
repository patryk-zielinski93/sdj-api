import { Component } from '@angular/core';
import * as io from 'socket.io-client';
import { WebSocketService } from '../web-socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
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

    this.inputForm.onsubmit = function(event) {
      event.preventDefault();

      var utterThis = new SpeechSynthesisUtterance(this.inputTxt.value);
      var selectedOption = this.voiceSelect.selectedOptions[0].getAttribute('data-name');
      for (var i = 0; i < this.voices.length; i++) {
        if (this.voices[i].name === selectedOption) {
          utterThis.voice = this.voices[i];
        }
      }
      utterThis.pitch = this.pitch.value;
      utterThis.rate = this.rate.value;
      this.synth.speak(utterThis);

      utterThis.onpause = function(event) {
        var char = event.utterance.text.charAt(event.charIndex);
        console.log('Speech paused at character ' + event.charIndex + ' of "' +
          event.utterance.text + '", which is "' + char + '".');
      };

      this.inputTxt.blur();
    }.bind(this);

    this.pitch.onchange = function() {
      this.pitchValue.textContent = this.pitch.value;
    }.bind(this);

    this.rate.onchange = function() {
      this.rateValue.textContent = this.rate.value;
    }.bind(this);

    var socket = io('http://localhost:8888');

    socket.on('connect', function() {
      console.log('Connected');
      socket.emit('events', { test: 'test' });
      socket.emit('identity', 0, function(response) {
          console.log('Identity:', response);
        }
      )
      ;
    });
    socket.on('events', function(data) {
      console.log('event', data);
    });
    socket.on('exception', function(data) {
      console.log('event', data);
    });
    socket.on('disconnect', function() {
      console.log('Disconnected');
    });

    socket.on('play_dj', (data) => {
      var dj = document.getElementById('dj');
      var open = document.getElementById('open');
      this.open.pause();
      if (this.dj.paused) {
        this.dj.load();
      }
      this.dj.play();
    });

    socket.on('play_radio', (data) => {
      this.dj.pause();
      if (this.open.paused) {
        this.open.load();
      }
      this.open.play();

    });

    socket.on('pozdro', (data) => {
      console.log(data.message);
      this.czytaj(data.message);
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

    var utterThis = new SpeechSynthesisUtterance(text);
    utterThis.onend = function(event) {
      event.preventDefault();
      this.dj.volume = 1;
      this.speeching = false;
    }.bind(this);
    var selectedOption = this.voiceSelect.selectedOptions[0].getAttribute('data-name');
    for (var i = 0; i < this.voices.length; i++) {
      if (this.voices[i].name === selectedOption) {
        utterThis.voice = this.voices[i];
      }
    }
    utterThis.pitch = this.pitch.value;
    utterThis.rate = this.rate.value;
    this.synth.speak(utterThis);

    this.timeout = setTimeout(function() {
      this.dj.volume = 1;
    }, 20000);
  }

  populateVoiceList() {
    this.voices = this.synth.getVoices();
    var selectedIndex = this.voiceSelect.selectedIndex < 0 ? 0 : this.voiceSelect.selectedIndex;
    this.voiceSelect.innerHTML = '';
    for (var i = 0; i < this.voices.length; i++) {
      var option = document.createElement('option');
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
