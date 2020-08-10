import { QueuedTrack } from '@sdj/ng/core/queued-track/domain';
import { Observable } from 'rxjs';

export abstract class QueuedTrackRepository {
  abstract getQueuedTracks(channelId: string): Observable<QueuedTrack[]>;
}
