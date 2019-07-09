import { AfterViewInit, Component, ViewChild, ElementRef } from "@angular/core";
import { environment } from "@environment/environment";
import { Observable, Subject, zip } from "rxjs";
import { filter, map, tap, delay, skipUntil } from "rxjs/operators";
import { appConfig } from "../configs/app.config";
import { QueuedTrack } from "./common/interfaces/queued-track.interface";
import { SpeechService } from "./modules/core/services/speech.service";
import { WebSocketService } from "./modules/core/services/web-socket.service";
import { AwesomePlayerComponent } from "./modules/main/components/awesome-player/awesome-player.component";
import { TrackUtil } from './modules/core/utils/track.util';

@Component({
  selector: "sdj-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements AfterViewInit {
  audioSrc = environment.radioStreamUrl;
  currentTrack: Observable<any>;
  getThumbnail = TrackUtil.getTrackThumbnail;
  listScrollSubject: Subject<void> = new Subject();
  queuedTracks: QueuedTrack[];
  queuedTracks$: Observable<QueuedTrack[]>;
  readonly queuedTrackskWidth = 210;
  @ViewChild("playerComponent")
  playerComponent: AwesomePlayerComponent;
  @ViewChild("toPlay")
  toPlayContainer: ElementRef<HTMLElement>;
  prvTrackId: number;

  constructor(
    private ws: WebSocketService,
    private speechService: SpeechService
  ) {}

  ngAfterViewInit(): void {
    this.handleSpeeching();
    this.handleWsEvents();
  }

  handleQueuedTrackList(): void {
    this.ws.getQueuedTrackListSubject().next();
    this.queuedTracks$ = zip(
      this.ws.getQueuedTrackListSubject().pipe(map(list => list.slice(1))),
      this.listScrollSubject
    ).pipe(
      map(([list, scrolled]) => {
        return list;
      })
    );

    this.ws
      .getQueuedTrackListSubject()
      .pipe(tap(list => this.handleScrollList(list.slice(1))))
      .subscribe();

    this.queuedTracks$.subscribe(list => {
      this.queuedTracks = list;
      this.toPlayContainer.nativeElement.scrollLeft += this.queuedTrackskWidth;
    });

    this.currentTrack = this.ws.getQueuedTrackListSubject().pipe(
      map(list => list[0]),
      filter((track: any) => track && track.id !== this.prvTrackId),
      tap((track: any) => (this.prvTrackId = track.id))
    );
  }

  handleSpeeching(): void {
    this.speechService.startListening();
    this.speechService.speeching.subscribe((speeching: boolean) => {
      if (speeching) {
        this.playerComponent.player.audio.volume = 0.1;
      } else {
        this.playerComponent.player.audio.volume = 1;
      }
    });
  }

  handleWsEvents(): void {
    const connect$ = this.ws.createSubject("connect");
    const events$ = this.ws.createSubject("events");
    connect$.subscribe(() => {
      console.log("Connected");
      events$.next(<any>{ test: "test" });
      this.handleQueuedTrackList();
    });
    events$.subscribe(data => console.log("event", data));
    const disconnect$ = this.ws.createSubject("disconnect");
    disconnect$.subscribe(() => console.log("Disconnected"));
    const exception$ = this.ws.createSubject("exception");
    exception$.subscribe(() => console.log("Disconnected"));

    const playDJ$ = this.ws.createSubject("play_dj");
    playDJ$.subscribe(data => {
      console.log("dj");
      this.audioSrc = environment.radioStreamUrl;
    });
    const playRadio$ = this.ws.createSubject("play_radio");
    playRadio$.subscribe(() => {
      console.log("radio");
      this.audioSrc = appConfig.externalStream;
    });
  }

  handleScrollList(newList: QueuedTrack[]): void {
    if (this.queuedTracks && newList.length < this.queuedTracks.length) {
      let scrollAmount = 0;
      const slideTimer: any = setInterval(() => {
        this.toPlayContainer.nativeElement.scrollLeft -= 10;
        scrollAmount += 10;
        if (scrollAmount >= this.queuedTrackskWidth) {
          this.listScrollSubject.next();
          window.clearInterval(slideTimer);
        }
      }, 25);
    } else {
      this.listScrollSubject.next();
    }
  }
}
