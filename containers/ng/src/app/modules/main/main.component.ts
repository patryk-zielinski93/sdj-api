import { AfterViewInit, Component, OnInit } from '@angular/core';
import { environment } from '@environment/environment';
import { Observable, Subject } from 'rxjs';
import { appConfig } from '../../../configs/app.config';
import { QueuedTrack } from '../../common/interfaces/queued-track.interface';
import { Channel } from '../../resources/entities/channel.entity';
import { ChannelService } from '../core/services/channel.service';
import { SpeechService } from '../core/services/speech.service';
import { WebSocketService } from '../core/services/web-socket.service';

@Component({
    selector: 'sdj-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit {
    audioSrc = environment.radioStreamUrl;
    channels: Observable<Channel[]>;
    dj: HTMLAudioElement;
    queuedTracks$: Subject<QueuedTrack[]>;

    constructor(private ws: WebSocketService, private channelService: ChannelService, private speechService: SpeechService) {
    }

    ngOnInit(): void {
        this.channels = this.channelService.getChannels();

    }

    ngAfterViewInit(): void {
        this.dj = <HTMLAudioElement>document.getElementById('dj');

        this.handleSpeeching();
        this.handleWsEvents();
    }

    handleQueuedTrackList(): void {
        this.queuedTracks$ = this.ws.getQueuedTrackListSubject();
        this.queuedTracks$.subscribe((list) => {
            console.log(list);
        });
        this.queuedTracks$.next();
    }

    handleSpeeching(): void {
        this.speechService.startListening();
        this.speechService.speeching.subscribe(
            (speeching: boolean) => {
                if (speeching) {
                    this.dj.volume = 0.1;
                } else {
                    this.dj.volume = 1;
                }
            }
        );
    }

    handleWsEvents(): void {
        const connect$ = this.ws.createSubject('connect');
        const events$ = this.ws.createSubject('events');
        connect$.subscribe(() => {
            console.log('Connected');
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
            if (this.audioSrc !== environment.radioStreamUrl) {
                this.dj.load();
            }
            this.dj.play();
            this.audioSrc = environment.radioStreamUrl;
        });
        const playRadio$ = this.ws.createSubject('play_radio');
        playRadio$.subscribe(() => {
            console.log('radio');
            if (this.audioSrc !== appConfig.externalStream) {
                this.dj.load();
            }
            this.dj.play();
            this.audioSrc = appConfig.externalStream;
        });
    }
}
