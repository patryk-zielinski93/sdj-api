import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { SlackHttpService } from './slack-http.service';
import { Channel } from '@sdj/shared/common';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  private selectedChannel$: Subject<Channel> = new BehaviorSubject(null);
  private channels: Channel[];
  private channels$: Subject<Channel[]> = new BehaviorSubject([]);

  constructor(private slackHttpService: SlackHttpService) {}

  getChannels(): Observable<Channel[]> {
    return this.channels$;
  }

  getSelectedChannel(): Observable<Channel> {
    return this.selectedChannel$;
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
    this.selectedChannel$.next(
      this.channels.find((channel: Channel) => channel.is_general)
    );
  }

  selectChannel(channel: Channel): void {
    this.selectedChannel$.next(channel);
  }
}
