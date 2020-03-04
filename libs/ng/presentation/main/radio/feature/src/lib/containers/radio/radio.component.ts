import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  ChannelFacade,
  QueuedTrackFacade,
  RadioFacade
} from '@sdj/ng/core/radio/application-services';
import {
  Channel,
  dynamicEnv,
  QueuedTrack,
  Track
} from '@sdj/ng/core/radio/domain';
import { AwesomePlayerComponent } from '@sdj/ng/presentation/shared/presentation-players';
import { User } from '@sdj/shared/domain';
import { TrackUtil, UserUtils } from '@sdj/shared/utils';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { merge, Observable, Subject } from 'rxjs';
import { filter, first, map, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'sdj-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadioComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('playerComponent')
  playerComponent: AwesomePlayerComponent;
  @ViewChild('toPlay')
  toPlayContainer: ElementRef<HTMLElement>;

  audioSrc: string = dynamicEnv.externalStream;
  currentTrack$ = this.queuedTrackFacade.currentTrack$;
  getThumbnail: (track: Track) => string = TrackUtil.getTrackThumbnail;
  getUserName: (user: User) => string = UserUtils.getUserName;
  listScrollSubject: Subject<QueuedTrack[]> = new Subject();
  queuedTracks: QueuedTrack[] = [];
  queuedTracks$: Observable<QueuedTrack[]>;
  readonly queuedTracksWidth: number = 210;
  selectedChannel: Channel;

  private selectedChannelUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private channelFacade: ChannelFacade,
    private chD: ChangeDetectorRef,
    private queuedTrackFacade: QueuedTrackFacade,
    private radioFacade: RadioFacade
  ) {}

  ngOnDestroy(): void {
    this.radioFacade.stopListeningForPozdro();
  }

  ngOnInit(): void {
    this.radioFacade.startListeningForPozdro();
  }

  ngAfterViewInit(): void {
    this.handleSpeeching();
    this.handleSelectedChannelChange();
  }

  handleAudioSource(): void {
    this.channelFacade.roomIsRunning$.pipe(first()).subscribe(() => {
      this.audioSrc = dynamicEnv.radioStreamUrl + this.selectedChannel.id;
      this.channelFacade.playDj$
        .pipe(takeUntil(this.selectedChannelUnsubscribe))
        .subscribe(() => {
          this.audioSrc = dynamicEnv.radioStreamUrl + this.selectedChannel.id;
          this.chD.markForCheck();
        });
      this.channelFacade.playRadio$
        .pipe(takeUntil(this.selectedChannelUnsubscribe))
        .subscribe(() => {
          this.audioSrc = dynamicEnv.externalStream;
          this.chD.markForCheck();
        });
    });
  }

  handleQueuedTrackList(): void {
    this.queuedTrackFacade.loadQueuedTracks(this.selectedChannel.id);
    const queuedTracks$ = this.queuedTrackFacade.queuedTracks$.pipe(
      takeUntil(this.selectedChannelUnsubscribe)
    );
    const trackWillBePlayed$ = queuedTracks$.pipe(
      map(list => list.slice(1)),
      filter(
        newList =>
          this.queuedTracks && newList.length < this.queuedTracks.length
      ),
      tap(list => this.handleScrollList(list))
    );
    trackWillBePlayed$.subscribe();

    const newTrackAddedToQueue$ = queuedTracks$.pipe(
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
      this.queuedTracks = list;
      const listElement = this.toPlayContainer.nativeElement;
      setTimeout(() => {
        listElement.scrollLeft +=
          listElement.scrollWidth - listElement.clientWidth;
      });
    });
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
    this.channelFacade.selectedChannel$
      .pipe(untilDestroyed(this))
      .subscribe((channel: Channel) => {
        this.selectedChannel = channel;
        this.selectedChannelUnsubscribe.next();
        this.selectedChannelUnsubscribe.complete();
        this.selectedChannelUnsubscribe = new Subject();
        this.channelFacade.join(channel.id);
        this.handleQueuedTrackList();
        this.handleAudioSource();
      });
  }

  handleSpeeching(): void {
    this.radioFacade.speeching$.subscribe((speeching: boolean) => {
      if (speeching) {
        this.playerComponent.player.audio.volume = 0.1;
      } else {
        this.playerComponent.player.audio.volume = 1;
      }
    });
  }
}
