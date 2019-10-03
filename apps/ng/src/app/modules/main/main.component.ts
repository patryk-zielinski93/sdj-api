import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@ng-environment/environment';
import { QueuedTrack, Track, WebSocketEvents } from '@sdj/shared/common';
import { merge, Observable, Subject } from 'rxjs';
import { filter, first, map, takeUntil, tap } from 'rxjs/operators';
import { Channel } from '../core/resources/interfaces/channel.interface';
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
  @ViewChild('playerComponent', { static: false })
  playerComponent: AwesomePlayerComponent;
  @ViewChild('toPlay', { static: false })
  toPlayContainer: ElementRef<HTMLElement>;

  audioSrc: string = environment.externalStream;
  channels$: Observable<Channel[]>;
  currentTrack: Observable<any>;
  listScrollSubject: Subject<QueuedTrack[]> = new Subject();
  queuedTracks: QueuedTrack[] = [];
  queuedTracks$: Observable<QueuedTrack[]>;
  readonly queuedTrackskWidth: number = 210;
  prvTrackId: number;
  selectedChannel: Channel;

  getThumbnail: (track: Track) => string = TrackUtil.getTrackThumbnail;

  private selectedChannelUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private channelService: ChannelService,
    private ws: WebSocketService,
    private route: ActivatedRoute,
    private speechService: SpeechService
  ) {}

  ngOnInit(): void {
    this.channels$ = this.channelService.getChannels();
    this.channelService.selectFirstChannel(
      this.route.snapshot.paramMap.get('channelId')
    );
    this.handleChannelChanges();
    this.handleQueuedTrackList();
    this.handleSelectedChannelChange();
  }

  ngAfterViewInit(): void {
    this.handleSpeeching();
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
      console.log(list.map(qTrack => qTrack.track));
      this.queuedTracks = list;
      const listElement = this.toPlayContainer.nativeElement;
      setTimeout(
        () =>
          (listElement.scrollLeft +=
            listElement.scrollWidth - listElement.clientWidth)
      );
    });

    this.currentTrack = wsSubject.pipe(
      map(list => list[0])

    );
  }

  handleAudioSource(): void {
    this.ws
      .createSubject(WebSocketEvents.roomIsRunning)
      .pipe(first())
      .subscribe(() => {
        console.log('roomIsRunning');
        this.audioSrc = environment.radioStreamUrl + this.selectedChannel.id;
        this.ws
          .createSubject(WebSocketEvents.playDj)
          .pipe(takeUntil(this.selectedChannelUnsubscribe))
          .subscribe(() => {
            console.log('dj');
            this.audioSrc =
              environment.radioStreamUrl + this.selectedChannel.id;
          });

        this.ws
          .createSubject(WebSocketEvents.playRadio)
          .pipe(takeUntil(this.selectedChannelUnsubscribe))
          .subscribe(() => {
            console.log('radio');
            this.audioSrc = environment.externalStream;
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

  handleSelectedChannelChange(): void {
    const join$ = this.ws.createSubject(WebSocketEvents.join);
    this.channelService.getSelectedChannel().subscribe((channel: Channel) => {
      this.selectedChannelUnsubscribe.next();
      this.selectedChannelUnsubscribe.complete();
      this.selectedChannelUnsubscribe = new Subject();
      this.handleQueuedTrackList();
      this.handleAudioSource();
      join$.next({ room: channel.id });
    });
  }

  selectChannel(channel: Channel): void {
    this.channelService.selectChannel(channel);
  }
}
