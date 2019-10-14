import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { environment } from '@ng-environment/environment';
import { QueuedTrack, Track, WebSocketEvents } from '@sdj/shared/common';
import { merge, Observable, Subject } from 'rxjs';
import { filter, first, map, takeUntil, tap } from 'rxjs/operators';
import { Channel } from '../../../../core/resources/interfaces/channel.interface';
import { ChannelService } from '../../../../core/services/channel.service';
import { SpeechService } from '../../../../core/services/speech.service';
import { WebSocketService } from '../../../../core/services/web-socket.service';
import { TrackUtil } from '../../../../core/utils/track.util';
import { AwesomePlayerComponent } from '../../awesome-player/awesome-player.component';

@Component({
  selector: 'sdj-radio-view',
  templateUrl: './radio-view.component.html',
  styleUrls: ['./radio-view.component.scss']
})
export class RadioViewComponent implements OnInit, AfterViewInit {

  @ViewChild('playerComponent', { static: false })
  playerComponent: AwesomePlayerComponent;
  @ViewChild('toPlay', { static: false })
  toPlayContainer: ElementRef<HTMLElement>;

  audioSrc: string = environment.externalStream;
  currentTrack: Observable<any>;
  getThumbnail: (track: Track) => string = TrackUtil.getTrackThumbnail;
  listScrollSubject: Subject<QueuedTrack[]> = new Subject();
  queuedTracks: QueuedTrack[] = [];
  queuedTracks$: Observable<QueuedTrack[]>;
  readonly queuedTracksWidth: number = 210;
  selectedChannel: Channel;

  private selectedChannelUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private channelService: ChannelService,
    private speechService: SpeechService,
    private ws: WebSocketService
  ) {
  }

  ngOnInit(): void {
    this.handleChannelChanges();
  }

  ngAfterViewInit(): void {
    this.handleQueuedTrackList();
    this.handleSpeeching();
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

  handleChannelChanges(): void {
    this.channelService.getSelectedChannel().subscribe((channel: Channel) => {
      this.selectedChannel = channel;
      this.handleSelectedChannelChange();
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

  handleScrollList(newList: QueuedTrack[]): void {
    if (this.queuedTracks && newList.length < this.queuedTracks.length) {
      let scrollAmount = 0;
      const slideTimer: any = setInterval(() => {
        this.toPlayContainer.nativeElement.scrollLeft -= 10;
        scrollAmount += 10;
        if (scrollAmount >= this.queuedTracksWidth) {
          this.listScrollSubject.next(newList);
          window.clearInterval(slideTimer);
        }
      }, 25);
    } else {
      this.listScrollSubject.next(newList);
    }
  }

  handleSelectedChannelChange(): void {
    const join$ = this.ws.createSubject(WebSocketEvents.join);

    this.channelService.getSelectedChannel().subscribe((channel: Channel) => {
      this.selectedChannelUnsubscribe.next();
      this.selectedChannelUnsubscribe.complete();
      this.selectedChannelUnsubscribe = new Subject();
      join$.next({ room: channel.id });
      this.handleQueuedTrackList();
      this.handleAudioSource();
    });
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
}
