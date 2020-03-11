import { Injectable } from '@angular/core';
import { Channel } from '@sdj/ng/core/channel/domain';
import { ChannelRepository } from '@sdj/ng/core/channel/domain-services';
import { WebSocketClient } from '@sdj/ng/core/shared/port';
import { WebSocketEvents } from '@sdj/shared/domain';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';

@Injectable()
export class ChannelFacade {
  channels$: Observable<Channel[]>;
  selectedChannel$: BehaviorSubject<Channel> = new BehaviorSubject(null);
  private channelsSrc = new BehaviorSubject([]);

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
    private channelRepository: ChannelRepository,
    private webSocketService: WebSocketClient
  ) {
    this.channels$ = this.channelsSrc.pipe(
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

  loadChannels(): Observable<Channel[]> {
    const source = this.channelRepository.getChannels();
    source.subscribe((channels: Channel[]) => {
      this.channelsSrc.next(channels);
    });
    return <any>source;
  }

  selectFirstChannel(channelId: string | null): void {
    if (channelId) {
      const channel = this.channelsSrc.value.find(
        (ch: Channel) => ch.id === channelId
      );
      this.selectChannel(channel);
    } else {
      this.selectGeneral();
    }
  }

  selectGeneral(): void {
    const channel = this.channelsSrc.value.find(
      (ch: Channel) => ch.name === 'general'
    );
    this.selectChannel(channel);
  }

  selectChannel(channel: Channel): void {
    if (
      !channel ||
      !this.selectedChannel$.value ||
      (this.selectedChannel$.value &&
        channel.id !== this.selectedChannel$.value.id)
    ) {
      this.selectedChannel$.next(channel);
    }
  }
}
