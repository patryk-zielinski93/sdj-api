import { Injectable } from '@angular/core';
import { QueuedTrack } from '@sdj/ng/core/queued-track/domain';
import { WebSocketClient } from '@sdj/ng/core/shared/port';
import { WebSocketEvents } from '@sdj/shared/domain';
import { defer, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class QueuedTrackRepository {
  constructor(private ws: WebSocketClient) {}

  getQueuedTracks(channelId: string): Observable<QueuedTrack[]> {
    return defer(() => {
      this.ws.emit(WebSocketEvents.queuedTrackList, channelId);
      return this.ws.observe<QueuedTrack[]>(WebSocketEvents.queuedTrackList);
    });
  }
}
