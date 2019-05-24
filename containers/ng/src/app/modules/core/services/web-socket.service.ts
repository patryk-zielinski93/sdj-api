import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import * as io from 'socket.io-client';
import { environment } from '../../../../environments/environment';
import { QueuedTrack } from '../../../common/interfaces/queued-track.interface';
import Socket = SocketIOClient.Socket;

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

    private socket: Socket;

  constructor() {
    this.socket = io(environment.backendUrl);
  }

  createSubject<T>(event: string): Subject<T> {
    let observable = new Observable(observer => {
      this.socket.on(event, (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });

    let observer = {
      next: (data: Object) => {
        this.socket.emit(event, JSON.stringify(data));
      }
    };

    return Subject.create(observer, observable);
  }

  getQueuedTrackListSubject(): Subject<QueuedTrack[]> {
    return this.createSubject<QueuedTrack[]>('queuedTrackList');
  }

}
