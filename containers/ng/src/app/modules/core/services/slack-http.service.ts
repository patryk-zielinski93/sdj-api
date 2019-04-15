import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Channel } from '../../../resources/entities/channel.entity';

@Injectable({
    providedIn: 'root'
})
export class SlackHttpService {
    readonly baseSlackUrl = 'https://slack.com/api/';
    readonly channelList = this.baseSlackUrl + 'channels.list';

    constructor(private http: HttpClient) {
    }

    getChannelList(): Observable<Channel[]> {
        return this.http.get<any>(this.channelList)
            .pipe(map(response => response.channels));
    }
}
