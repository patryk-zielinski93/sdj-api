import { Injectable } from '@angular/core';
import { QueuedTrack, WebSocketEvents } from '@sdj/shared/common';
import { fromEvent, Subject } from 'rxjs';
import * as io from 'socket.io-client';
import { environment } from '../../../../environments/environment';
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
    this.socket.on('connect', () => console.log('elo'));
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
