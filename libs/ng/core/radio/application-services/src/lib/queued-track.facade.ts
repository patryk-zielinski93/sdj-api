import { Injectable } from '@angular/core';
import { QueuedTrackRepository } from '@sdj/ng/core/radio/domain-services';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { QueuedTrack } from '@sdj/ng/core/radio/domain';

@Injectable()
export class QueuedTrackFacade {
  queuedTracks$ = new BehaviorSubject<QueuedTrack[]>([]);
  currentTrack$ = this.queuedTracks$.pipe(
    map<QueuedTrack[], QueuedTrack>(list => list[0])
  );

  constructor(private queuedTrackRepository: QueuedTrackRepository) {}

  loadQueuedTracks(channelId: string): void {
    this.queuedTrackRepository
      .getQueuedTracks(channelId)
      .subscribe(queuedTracks => {
        this.queuedTracks$.next(queuedTracks);
      });
  }
}
