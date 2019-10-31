import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Channel } from '@sdj/shared/common';
import { Observable } from 'rxjs';
import { filter, first, switchMap, tap } from 'rxjs/operators';
import { ChannelService } from '../core/services/channel.service';

@Injectable({ providedIn: 'root' })
export class ChannelResolver implements Resolve<Channel[]> {
  constructor(private channelService: ChannelService) {
  }

  findChannelIdParam(route: ActivatedRouteSnapshot) {

    let channelId = route.paramMap.get('channelId');
    if (channelId) {
      return channelId;
    } else {
      route.children.some(r => {
        channelId = this.findChannelIdParam(r);
        return !!channelId;
      });
    }

    return channelId;
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    const channelIdParam = this.findChannelIdParam(route);

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