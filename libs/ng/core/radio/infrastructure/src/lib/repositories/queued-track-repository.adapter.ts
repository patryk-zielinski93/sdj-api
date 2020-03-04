import { Injectable } from '@angular/core';
import { QueuedTrack } from '@sdj/ng/core/radio/domain';
import { QueuedTrackRepository } from '@sdj/ng/core/radio/domain-services';
import { WebSocketClient } from '@sdj/ng/core/shared/port';
import { WebSocketEvents } from '@sdj/shared/domain';
import { defer, Observable } from 'rxjs';

@Injectable()
export class QueuedTrackRepositoryAdapter extends QueuedTrackRepository {
  constructor(private ws: WebSocketClient) {
    super();
  }

  getQueuedTracks(channelId: string): Observable<QueuedTrack[]> {
    return defer(() => {
      this.ws.emit(WebSocketEvents.queuedTrackList, channelId);
      return this.ws.observe<QueuedTrack[]>(WebSocketEvents.queuedTrackList);
    });
  }
}
