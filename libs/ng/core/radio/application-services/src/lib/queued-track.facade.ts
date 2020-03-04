import { Injectable } from '@angular/core';
import { QueuedTrackRepository } from '@sdj/ng/core/radio/domain-services';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class QueuedTrackFacade {
  queuedTracks$ = new BehaviorSubject([]);
  currentTrack$ = this.queuedTracks$.pipe(map(list => list[0]));

  constructor(private queuedTrackRepository: QueuedTrackRepository) {}

  loadQueuedTracks(channelId: string): void {
    this.queuedTrackRepository
      .getQueuedTracks(channelId)
      .subscribe(queuedTracks => {
        this.queuedTracks$.next(queuedTracks);
      });
  }
}
