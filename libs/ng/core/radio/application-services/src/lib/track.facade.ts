import { Injectable } from '@angular/core';
import { Track } from '@sdj/ng/core/radio/domain';
import { TrackRepository } from '@sdj/ng/core/radio/domain-services';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class TrackFacade {
  mostPlayedTracks$ = new BehaviorSubject<Track[]>([]);
  mostPlayedTracksLoading$ = new BehaviorSubject<boolean>(false);

  constructor(private trackRepository: TrackRepository) {}

  loadMostPlayedTracks(channelId: string): void {
    this.trackRepository
      .loadMostPlayedTracks(channelId)
      .pipe(
        tap(({ data, loading }) => {
          this.mostPlayedTracks$.next(data.mostPlayedTracks);
          this.mostPlayedTracksLoading$.next(loading);
        })
      )
      .subscribe();
  }
}
