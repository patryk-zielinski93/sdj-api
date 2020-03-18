import { Injectable } from '@angular/core';
import { Channel } from '@sdj/ng/core/channel/domain';
import { ChannelRepository } from '@sdj/ng/core/channel/domain-services';
import { WebSocketClient } from '@sdj/ng/core/shared/port';
import { WebSocketEvents } from '@sdj/shared/domain';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable()
export class ChannelFacade {
  channels$ = new BehaviorSubject([]);
  selectedChannel$: BehaviorSubject<Channel> = new BehaviorSubject(null);

  constructor(
    private channelRepository: ChannelRepository,
    private webSocketService: WebSocketClient
  ) {
    this.handleSelectedChannel();
  }

  leaveChannel(channel: Channel): void {
    this.webSocketService.emit(WebSocketEvents.leaveChannel, channel.id);
  }

  loadChannels(): Observable<Channel[]> {
    const source = this.channelRepository.getChannels();
    source.subscribe((channels: Channel[]) => {
      this.channels$.next(channels);
    });
    this.webSocketService
      .createSubject(WebSocketEvents.channels)
      .pipe(
        map(channels =>
          this.channels$.value.map((channel: Channel) => ({
            ...channel,
            ...channels[channel.id],
            name: channel.name
          }))
        )
      )
      .subscribe((channels: Channel[]) => {
        this.channels$.next(channels);
      });
    return source;
  }

  selectFirstChannel(channelId: string | null): void {
    if (channelId) {
      const channel = this.channels$.value.find(
        (ch: Channel) => ch.id === channelId
      );
      this.selectChannel(channel);
    } else {
      this.selectGeneral();
    }
  }

  selectGeneral(): void {
    const channel = this.channels$.value.find(
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

  private handleSelectedChannel(): void {
    this.channels$
      .pipe(filter<Channel[]>(() => !!this.selectedChannel$.value))
      .subscribe(channels => {
        const selectedChannel = this.selectedChannel$.value;
        const newSelectedChannel = channels.find(
          channel => channel.id === selectedChannel.id
        );
        if (newSelectedChannel) {
          this.selectedChannel$.next(newSelectedChannel);
        }
      });
  }
}
