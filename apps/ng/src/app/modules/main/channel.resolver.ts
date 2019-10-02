import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { Channel } from '@sdj/shared/common';
import { filter, first, skip, switchMap, tap } from 'rxjs/operators';
import { ChannelService } from '../core/services/channel.service';

@Injectable({ providedIn: 'root' })
export class ChannelResolver implements Resolve<Channel[]> {
  constructor(private channelService: ChannelService) {
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    const channelIdParam = route.paramMap.get('channelId');

    return this.channelService.getChannels()
      .pipe(tap(channels => {
          if (!channels || !channels.length) {
            this.channelService.loadChannels();
          }
        }),
        filter(channels => !!channels && !!channels.length),
        first(),
        switchMap(_ => this.channelService.getSelectedChannel()),
        tap((channel: Channel) => {
          if (!channel) {
            this.channelService.selectFirstChannel(channelIdParam);
          }
        }),
        filter((channel: Channel) => !!channel),
        first());
  }
}
