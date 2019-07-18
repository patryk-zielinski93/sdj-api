import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Controls } from '../../../../libs/player/src/controls';
import { Framer } from '../../../../libs/player/src/framer';
import { Player } from '../../../../libs/player/src/player';
import { Scene } from '../../../../libs/player/src/scene';
import { Tracker } from '../../../../libs/player/src/tracker';

@Component({
  selector: 'sdj-awesome-player',
  templateUrl: './awesome-player.component.html',
  styleUrls: ['./awesome-player.component.scss']
})
export class AwesomePlayerComponent implements OnInit, AfterViewInit {
  get src(): string {
    return this._src;
  }

  @Input()
  set src(value: string) {
    this._src = value;
    if (this.player) {
      this.player.src = value;
    }
  }

  get track$(): Observable<any> {
    return this._track$;
  }

  @Input()
  set track$(value: Observable<any>) {
    this._track$ = value;
    if (this.player) {
      this.player.track = this.track$;
    }
  }

  public player: Player;
  private framer: Framer;
  private scene: Scene;

  private _src: string;
  private _track$: Observable<any>;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.framer = new Framer();
    const tracker = new Tracker();
    this.framer.tracker = tracker;
    const controls = new Controls();

    this.scene = new Scene(this.framer, tracker, controls);
    this.player = new Player(this.scene, this.framer);
    if (this.track$) {
      this.player.track = this.track$;
    }

    controls.player = this.player;
    controls.scene = this.scene;
    controls.tracker = tracker;

    tracker.player = this.player;

    this.player.init();
    this.player.src = this.src;
  }
}
