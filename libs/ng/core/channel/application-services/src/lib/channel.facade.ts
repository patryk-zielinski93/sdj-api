import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ChannelPartialState } from './+state/channel.reducer';
import { channelQuery } from './+state/channel.selectors';
import { LoadChannelsQuery } from './queries/load-channels.query';
import { SelectChannelService } from './services/select-channel.service';

@Injectable({ providedIn: 'root' })
export class ChannelFacade {
  channels$ = this.store.pipe(select(channelQuery.channels));
  selectedChannel$ = this.store.pipe(select(channelQuery.selectedChannel));

  constructor(
    private selectChannelService: SelectChannelService,
    private store: Store<ChannelPartialState>
  ) {}

  loadChannels(): void {
    this.store.dispatch(new LoadChannelsQuery());
  }

  selectFirstChannel(channelId: string | null): void {
    this.selectChannelService.selectFirstChannel(channelId);
  }

  selectChannel(channelId: string): void {
    this.selectChannelService.selectChannel(channelId);
  }
}
