import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '@environment/environment';
import { Observable, Subject } from 'rxjs';
import { filter, first, map, tap } from 'rxjs/operators';
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
    audioSrc = environment.radioStreamUrl;
    channels$: Observable<Channel[]>;
    currentTrack: Observable<any>;
    queuedTracks$: Subject<QueuedTrack[]>;
    @ViewChild('playerComponent')
    playerComponent: AwesomePlayerComponent;
    prvTrackId: number;

    constructor(private channelService: ChannelService, private ws: WebSocketService, private speechService: SpeechService) {
    }

    ngOnInit(): void {
        this.channels$ = this.channelService.getChannels();
    }

    ngAfterViewInit(): void {
        this.handleSpeeching();
        this.handleWsEvents();
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
            this.channels$.pipe(first())
                .subscribe((channels: Channel[]) => {
                    join$.next({ room: channels[Math.floor(Math.random() * 2)].id });
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

        const playDJ$ = this.ws.createSubject('play_dj');
        playDJ$.subscribe((data) => {
            console.log('dj');
            this.audioSrc = environment.radioStreamUrl;
        });
        const playRadio$ = this.ws.createSubject('play_radio');
        playRadio$.subscribe(() => {
            console.log('radio');
            this.audioSrc = appConfig.externalStream;
        });
    }
}
