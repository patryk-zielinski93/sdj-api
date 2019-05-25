import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '@environment/environment';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, first, map, tap } from 'rxjs/operators';
import { appConfig } from '../../../configs/app.config';
import { QueuedTrack } from '../../common/interfaces/queued-track.interface';
import { Channel } from '../../resources/entities/channel.entity';
import { ChannelService } from '../core/services/channel.service';
import { SpeechService } from '../core/services/speech.service';
import { WebSocketService } from '../core/services/web-socket.service';
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
  queuedTracks$: Subject<QueuedTrack[]>;
  @ViewChild('playerComponent')
  playerComponent: AwesomePlayerComponent;
  prvTrackId: number;
  selectedChannel: Channel;

  constructor(private channelService: ChannelService, private ws: WebSocketService, private speechService: SpeechService) {
  }

  ngOnInit(): void {
    this.channels$ = this.channelService.getChannels();
    this.handleChannelChanges();
  }

  ngAfterViewInit(): void {
    this.handleSpeeching();
    this.handleWsEvents();
    this.handleAudioSource();
  }

  handleChannelChanges(): void {
    this.channelService.getSelectedChannel()
      .subscribe((channel: Channel) => {
        this.selectedChannel = channel;
      });
  }

  handleQueuedTrackList(): void {
    this.queuedTracks$ = this.ws.getQueuedTrackListSubject();
    this.queuedTracks$.next();

    this.currentTrack = this.queuedTracks$
      .pipe(map((list) => list[0]),
        filter((track: any) => track && track.id !== this.prvTrackId),
        tap((track: any) => this.prvTrackId = track.id)
      );
  }

  handleAudioSource(): void {
    this.channelService.getSelectedChannel()
      .pipe(distinctUntilChanged((room1, room2) => room1.id !== room2.id))
      .subscribe((selectedRoom: Channel) => {
        this.ws.createSubject('roomIsRunning')
          .pipe(first())
          .subscribe(() => {
            this.audioSrc = environment.radioStreamUrl + selectedRoom.id;
          });
      });
    this.ws.createSubject('play_dj')
      .subscribe(() => {
        console.log('dj');
        this.audioSrc = environment.radioStreamUrl + this.selectedChannel.id;
      });

    this.ws.createSubject('play_radio')
      .subscribe(() => {
        console.log('radio');
        this.audioSrc = appConfig.externalStream;
      });
  }

  handleSpeeching(): void {
    this.speechService.startListening();
    this.speechService.speeching.subscribe(
      (speeching: boolean) => {
        if (speeching) {
          this.playerComponent.player.audio.volume = 0.1;
        } else {
          this.playerComponent.player.audio.volume = 1;
        }
      }
    );
  }

  handleWsEvents(): void {
    const connect$ = this.ws.createSubject('connect');
    const events$ = this.ws.createSubject('events');
    const join$ = this.ws.createSubject('join');
    const newUser$ = this.ws.createSubject('newUser');
    connect$.subscribe((socket) => {
      this.channelService.getSelectedChannel()
        .subscribe((channel: Channel) => {
          join$.next({ room: channel.id });
        });
      newUser$.subscribe((data) => console.log(data));
      events$.next(<any>{ test: 'test' });
      this.handleQueuedTrackList();
    });
    events$.subscribe((data) => console.log('event', data));
    const disconnect$ = this.ws.createSubject('disconnect');
    disconnect$.subscribe(() => console.log('Disconnected'));
    const exception$ = this.ws.createSubject('exception');
    exception$.subscribe(() => console.log('Disconnected'));
  }

  selectChannel(channel: Channel): void {
    this.channelService.selectChannel(channel);
  }
}
