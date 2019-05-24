import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Channel } from '../../../resources/entities/channel.entity';
import { SlackHttpService } from './slack-http.service';

@Injectable({
    providedIn: 'root'
})
export class ChannelService {
    private selectedChannel: Channel;
    private channels: Channel[];
    private channels$: Subject<Channel[]> = new BehaviorSubject([]);

    constructor(private slackHttpService: SlackHttpService) {
    }

    getChannels(): Observable<Channel[]> {
        return this.channels$;
    }

    loadChannels(): Observable<Channel[]> {
        const source = this.slackHttpService.getChannelList();
        source.subscribe((channels: Channel[]) => {
            this.channels$.next(channels);
            this.channels = channels;
            this.selectGeneral();
        });
        return source;
    }

    selectGeneral(): void {
        this.selectedChannel = this.channels.find((channel: Channel) => channel.is_general);
    }
}
