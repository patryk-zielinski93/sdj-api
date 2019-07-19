import { Injectable } from '@angular/core';
import { Observable, Subject, fromEvent } from 'rxjs';
import * as io from 'socket.io-client';
import { environment } from '../../../../environments/environment';
import Socket = SocketIOClient.Socket;
import { QueuedTrack } from '@sdj/shared/common';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private queuedTrackList$: Subject<QueuedTrack[]>;
  private socket: Socket;

  constructor() {
    this.socket = io(environment.backendUrl);
  }

  createSubject<T>(event: string): Subject<T> {
    let observable = fromEvent(this.socket, event);

    let observer = {
      next: (data: Object) => {
        this.socket.emit(event, JSON.stringify(data));
      }
    };

    return Subject.create(observer, observable);
  }

  getQueuedTrackListSubject(): Subject<QueuedTrack[]> {
    if (!this.queuedTrackList$) {
      this.queuedTrackList$ = this.createSubject<QueuedTrack[]>(
        'queuedTrackList'
      );
    }
    return this.queuedTrackList$;
  }
}
