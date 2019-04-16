import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Channel } from '../../../resources/entities/channel.entity';
import { SlackHttpService } from './slack-http.service';

@Injectable({
    providedIn: 'root'
})
export class ChannelService {
    private selectedChannel: Channel;
    private channels: Channel[];
    private channels$: Observable<Channel[]>;

    constructor(private slackHttpService: SlackHttpService) {
    }

    getChannels(): Observable<Channel[]> {
        return this.channels$;
    }

    loadChannels(): void {
        this.channels$ = this.slackHttpService.getChannelList();
        this.channels$.subscribe((channels: Channel[]) => {
            this.channels = channels;
            this.selectGeneral();
        });
    }

    selectGeneral(): void {
        this.selectedChannel = this.channels.find((channel: Channel) => channel.is_general);
    }
}
