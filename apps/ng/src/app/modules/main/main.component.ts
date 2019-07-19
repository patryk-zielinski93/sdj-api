import { QueuedTrack } from '@sdj/shared/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import { environment } from '@ng-environment/environment';
import { merge, Observable, Subject } from 'rxjs';
import { filter, first, map, takeUntil, tap } from 'rxjs/operators';

import { appConfig } from '../../../configs/app.config';
import { Channel } from '@sdj/shared/common';
import { ChannelService } from '../core/services/channel.service';
import { SpeechService } from '../core/services/speech.service';
import { WebSocketService } from '../core/services/web-socket.service';
import { TrackUtil } from '../core/utils/track.util';
import { AwesomePlayerComponent } from './components/awesome-player/awesome-player.component';

@Component({
  selector: 'sdj-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit {
  audioSrc = appConfig.externalStream;
  channels$: Observable<Channel[]>;
  currentTrack: Observable<any>;
  getThumbnail = TrackUtil.getTrackThumbnail;
  listScrollSubject: Subject<QueuedTrack[]> = new Subject();
  queuedTracks: QueuedTrack[] = [];
  queuedTracks$: Observable<QueuedTrack[]>;
  readonly queuedTrackskWidth = 210;
  @ViewChild('playerComponent', { static: false })
  playerComponent: AwesomePlayerComponent;
  @ViewChild('toPlay', { static: false })
  toPlayContainer: ElementRef<HTMLElement>;
  prvTrackId: number;
  selectedChannel: Channel;

  private selectedChannelUnsubscribe = new Subject<void>();
  tmp = 0;

  constructor(
    private channelService: ChannelService,
    private ws: WebSocketService,
    private speechService: SpeechService
  ) {}

  ngOnInit(): void {
    this.channels$ = this.channelService.getChannels();
    this.handleChannelChanges();
  }

  ngAfterViewInit(): void {
    this.handleSpeeching();
    this.handleWsEvents();
  }

  handleChannelChanges(): void {
    this.channelService.getSelectedChannel().subscribe((channel: Channel) => {
      this.selectedChannel = channel;
    });
  }

  handleQueuedTrackList(): void {
    const wsSubject = this.ws
      .getQueuedTrackListSubject()
      .pipe(takeUntil(this.selectedChannelUnsubscribe));
    this.ws.getQueuedTrackListSubject().next(<any>this.selectedChannel.id);
    const trackWillBePlayed$ = wsSubject.pipe(
      map(list => list.slice(1)),
      filter(
        newList =>
          this.queuedTracks && newList.length < this.queuedTracks.length
      ),
      tap(list => this.handleScrollList(list))
    );
    trackWillBePlayed$.subscribe();

    const newTrackAddedToQueue$ = wsSubject.pipe(
      map(list => list.slice(1)),
      filter(
        newList =>
          !this.queuedTracks || newList.length >= this.queuedTracks.length
      )
    );
    this.queuedTracks$ = merge(
      this.listScrollSubject,
      newTrackAddedToQueue$
    ).pipe(takeUntil(this.selectedChannelUnsubscribe));

    this.queuedTracks$.subscribe(list => {
      console.log(list.map(qTrack => qTrack.track))
      this.queuedTracks = list;
      const listElement = this.toPlayContainer.nativeElement;
      listElement.scrollLeft +=
        listElement.scrollWidth - listElement.clientWidth;
    });

    this.currentTrack = wsSubject.pipe(
      map(list => list[0]),
      filter(
        (track: QueuedTrack) =>
          (!track && !!this.prvTrackId) ||
          (!!track && track.id !== this.prvTrackId)
      ),
      tap((track: QueuedTrack) => (this.prvTrackId = track ? track.id : null))
    );
  }

  handleAudioSource(): void {
    this.ws
      .createSubject('roomIsRunning')
      .pipe(first())
      .subscribe(() => {
        console.log('roomIsRunning');
        this.audioSrc = environment.radioStreamUrl + this.selectedChannel.id;
        this.ws
          .createSubject('play_dj')
          .pipe(takeUntil(this.selectedChannelUnsubscribe))
          .subscribe(() => {
            console.log('dj');
            this.audioSrc =
              environment.radioStreamUrl + this.selectedChannel.id;
          });

        this.ws
          .createSubject('play_radio')
          .pipe(takeUntil(this.selectedChannelUnsubscribe))
          .subscribe(() => {
            console.log('radio');
            this.audioSrc = appConfig.externalStream;
          });
      });
  }

  handleScrollList(newList: QueuedTrack[]): void {
    if (this.queuedTracks && newList.length < this.queuedTracks.length) {
      let scrollAmount = 0;
      const slideTimer: any = setInterval(() => {
        this.toPlayContainer.nativeElement.scrollLeft -= 10;
        scrollAmount += 10;
        if (scrollAmount >= this.queuedTrackskWidth) {
          this.listScrollSubject.next(newList);
          window.clearInterval(slideTimer);
        }
      }, 25);
    } else {
      this.listScrollSubject.next(newList);
    }
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
    const connect$ = this.ws.createSubject('connect');
    const join$ = this.ws.createSubject('join');
    connect$.subscribe(socket => {
      this.handleQueuedTrackList();
      this.channelService.getSelectedChannel().subscribe((channel: Channel) => {
        this.selectedChannelUnsubscribe.next();
        this.selectedChannelUnsubscribe.complete();
        this.selectedChannelUnsubscribe = new Subject();
        this.handleQueuedTrackList();
        this.handleAudioSource();
        join$.next({ room: channel.id });
      });
    });
  }

  selectChannel(channel: Channel): void {
    this.channelService.selectChannel(channel);
  }
}
