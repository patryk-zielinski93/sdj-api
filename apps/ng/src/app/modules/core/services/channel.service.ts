import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { WebSocketEvents } from '@sdj/shared/common';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, switchMap, startWith } from 'rxjs/operators';
import { SlackHttpService } from './slack-http.service';
import { WebSocketService } from './web-socket.service';
import { Channel } from '../resources/interfaces/channel.interface';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  private selectedChannel$: Subject<Channel> = new BehaviorSubject(null);
  private channels: Channel[];
  private channels$: Subject<Channel[]> = new BehaviorSubject([]);

  get webSocketChannels(): Observable<Channel[]> {
    if (!this._webSocketChannels) {
      this._webSocketChannels = this.webSocketService
        .createSubject(WebSocketEvents.channels)
        .pipe(startWith(<any>{}));
    }
    return this._webSocketChannels;
  }
  private _webSocketChannels: Observable<Channel[]>;
  constructor(
    private router: Router,
    private slackHttpService: SlackHttpService,
    private webSocketService: WebSocketService
  ) {}

  getChannels(): Observable<Channel[]> {
    return this.channels$.pipe(
      switchMap((channels: Channel[]) =>
        this.webSocketChannels.pipe(
          map(sockets => {
            return channels.map((channel: Channel) => {
              if (sockets[channel.id]) {
                channel.users = sockets[channel.id].length;
              } else {
                channel.users = 0;
              }
              return channel;
            });
          })
        )
      )
    );
  }

  getSelectedChannel(): Observable<Channel> {
    return this.selectedChannel$;
  }

  loadChannels(): Observable<Channel[]> {
    const source = this.slackHttpService.getChannelList();
    source.subscribe((channels: Channel[]) => {
      this.channels$.next(channels);
      this.channels = channels;
    });
    return <any>source;
  }

  selectFirstChannel(channelId: string | null): void {
    if (channelId) {
      this.selectedChannel$.next(
        this.channels.find((channel: Channel) => channel.id === channelId)
      );
    } else {
      this.selectGeneral();
    }
  }

  selectGeneral(): void {
    this.selectedChannel$.next(
      this.channels.find((channel: Channel) => channel.is_general)
    );
  }

  selectChannel(channel: Channel): void {
    this.selectedChannel$.next(channel);
    this.router.navigate([channel.id]);
  }
}
