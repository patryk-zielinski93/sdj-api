import { Injectable } from '@angular/core';
import { environment } from '@ng-environment/environment';
import { QueuedTrack, WebSocketEvents } from '@sdj/shared/domain';
import { fromEvent, Subject } from 'rxjs';
import * as io from 'socket.io-client';
import Socket = SocketIOClient.Socket;

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private queuedTrackList$: Subject<QueuedTrack[]>;
  private socket: Socket;

  constructor() {
    this.socket = io(environment.backendUrl);
    this.socket.connect();
  }

  createSubject<T>(event: string): Subject<T> {
    const observable = fromEvent(this.socket, event);

    const observer = {
      next: (data: Object) => {
        this.socket.emit(event, JSON.stringify(data));
      }
    };

    return Subject.create(observer, observable);
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
