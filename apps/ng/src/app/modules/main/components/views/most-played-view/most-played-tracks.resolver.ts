import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Channel, Track } from '@sdj/shared/common';
import { Observable } from 'rxjs';
import { filter, first, switchMap } from 'rxjs/operators';
import { TrackApiService } from '../../../../core/api-services/track.api-service';
import { ChannelService } from '../../../../core/services/channel.service';

@Injectable()
export class MostPlayedTracksResolver implements Resolve<Track[]> {
  constructor(private readonly channelService: ChannelService, private readonly trackApiService: TrackApiService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Track[]> | Promise<Track[]> | Track[] {
    return this.channelService.getSelectedChannel()
      .pipe(
        filter(channel => !!channel),
        switchMap((channel: Channel) => this.trackApiService.loadMostPlayedTracks(channel.id)),
        first()
      );
  }

}
