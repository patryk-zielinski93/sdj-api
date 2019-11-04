import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Channel } from '@sdj/ng/shared/domain';
import { WebSocketEvents } from '@sdj/shared/domain';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { SlackService } from './slack.service';
import { WebSocketService } from './web-socket.service';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  private selectedChannel$: BehaviorSubject<Channel> = new BehaviorSubject(
    null
  );
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
    private slackRepository: SlackService,
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
    const source = this.slackRepository.getChannelList();
    source.subscribe((channels: Channel[]) => {
      this.channels = channels;
      this.channels$.next(channels);
    });
    return <any>source;
  }

  selectFirstChannel(channelId: string | null): void {
    if (channelId) {
      const channel = this.channels.find(
        (channel: Channel) => channel.id === channelId
      );
      this.selectChannel(channel);
    } else {
      this.selectGeneral();
    }
  }

  selectGeneral(): void {
    const channel = this.channels.find(
      (channel: Channel) => channel.is_general
    );
    this.selectChannel(channel);
  }

  selectChannel(channel: Channel): void {
    const oldChannel = this.selectedChannel$.value;
    this.selectedChannel$.next(channel);
    if (oldChannel && this.router.url.includes(oldChannel.id)) {
      this.router.navigateByUrl(
        this.router.url.replace(oldChannel.id, channel.id)
      );
    } else if (this.router.url.includes(channel.id)) {
      return;
    } else {
      this.router.navigate([channel.id]);
    }
  }
}
