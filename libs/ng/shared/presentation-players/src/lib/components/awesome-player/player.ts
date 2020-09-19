import { Subject } from 'rxjs';
import { Scene } from './scene';

import { Ticks } from './ticks';

export class Player {
  get src(): string {
    return this._src;
  }

  set src(value: string) {
    if (value !== this.src && value) {
      this._src = value;
      this.audio.src = value;
      this.audio.load();
      if (this.context.state === 'running') {
        this.audio.play();
      }
    }
  }

  isLoadingChange$: Subject<boolean> = new Subject<boolean>();

  public audio: HTMLAudioElement;
  public context: AudioContext;

  private analyser: AnalyserNode;
  private destination: AudioDestinationNode;
  private gainNode: GainNode;
  private javascriptNode: ScriptProcessorNode;
  private source: MediaElementAudioSourceNode;
  private _src: string;

  constructor(private scene: Scene, private ticks: Ticks) {}

  destroy(): void {
    this.audio.remove();
    this.isLoadingChange$.complete();
  }

  init(): void {
    (<any>window).AudioContext =
      (<any>window).AudioContext || (<any>window).webkitAudioContext;
    if (!AudioContext) {
      return;
    }
    this.context = new AudioContext();
    if (this.context.suspend) {
      this.context.suspend();
    }
    this.javascriptNode = this.context.createScriptProcessor(2048, 1, 1);
    this.javascriptNode.connect(this.context.destination);
    this.analyser = this.context.createAnalyser();
    this.analyser.connect(this.javascriptNode);
    this.analyser.smoothingTimeConstant = 0.6;
    this.analyser.fftSize = 2048;
    this.audio = <HTMLAudioElement>document.getElementById('playerHtmlAudio');
    this.audio.crossOrigin = 'anonymous';
    this.audio.addEventListener('ended', this.replayStream.bind(this));
    this.audio.addEventListener('error', this.replayStream.bind(this));
    this.source = this.context.createMediaElementSource(this.audio);
    this.destination = this.context.destination;

    this.gainNode = this.context.createGain();
    this.source.connect(this.gainNode);
    this.gainNode.connect(this.analyser);
    this.gainNode.connect(this.destination);

    this.initHandlers();
    this.scene.init();
  }

  play(): void {
    if (this.context.resume) {
      this.context.resume();
    }
    this.audio.load();
    this.audio.play();
  }

  stop(): void {
    this.audio.pause();
    this.context.suspend();
  }

  pause(): void {
    if (this.context.suspend) {
      this.context.suspend();
    }
    this.audio.pause();
  }

  mute(): void {
    this.gainNode.gain.value = 0;
  }

  unmute(): void {
    this.gainNode.gain.value = 1;
  }

  initHandlers(): void {
    this.audio.addEventListener('play', this.emitIsNotLoading.bind(this));
    this.audio.addEventListener('canplay', this.emitIsNotLoading.bind(this));
    this.audio.addEventListener('playing', this.emitIsNotLoading.bind(this));
    this.audio.addEventListener('ended', this.emitIsLoading.bind(this));
    this.audio.addEventListener('progress', () => {
      if (this.context.state === 'running' && this.audio.currentTime === 0) {
        this.emitIsLoading();
      }
    });
    this.audio.addEventListener('waiting', this.emitIsLoading.bind(this));

    // ToDo onaudioprocess is deprecated
    // tslint:disable-next-line
    this.javascriptNode.onaudioprocess = () => {
      this.ticks.frequencyData = new Uint8Array(
        this.analyser.frequencyBinCount
      );
      this.analyser.getByteFrequencyData(this.ticks.frequencyData);
    };
  }

  private emitIsLoading(): void {
    this.isLoadingChange$.next(true);
  }

  private emitIsNotLoading(): void {
    this.isLoadingChange$.next(false);
  }

  private replayStream(): void {
    setTimeout(() => {
      this.audio.load();
      if (this.context.state === 'running') {
        this.audio.play().catch(() => {});
      }
    }, 1000);
  }
}
