import { Injectable } from '@angular/core';
import { dynamicEnv } from '@sdj/ng/core/radio/domain';
import { QueuedTrack, WebSocketEvents } from '@sdj/shared/domain';
import { fromEvent, Observer, Subject } from 'rxjs';
import { AnonymousSubject } from 'rxjs/internal-compatibility';
import * as io from 'socket.io-client';
import Socket = SocketIOClient.Socket;

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private queuedTrackList$: Subject<QueuedTrack[]>;
  private socket: Socket;

  constructor() {
    this.socket = io(dynamicEnv.backendUrl);
    this.socket.connect();
  }

  createSubject<T>(event: string): Subject<T> {
    const observable = fromEvent<T>(this.socket, event);

    const observer: Observer<T> = {
      next: (data: Object) => {
        this.socket.emit(event, JSON.stringify(data));
      },
      error: () => {},
      complete: () => {}
    };

    return new AnonymousSubject<T>(observer, observable);
  }

  getQueuedTrackListSubject(): Subject<QueuedTrack[]> {
    if (!this.queuedTrackList$) {
      this.queuedTrackList$ = this.createSubject<QueuedTrack[]>(
        WebSocketEvents.queuedTrackList
      );
    }
    return this.queuedTrackList$;
  }
}
