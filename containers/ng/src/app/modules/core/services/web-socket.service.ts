import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  // Our socket connection
  private socket;

  constructor() {
    this.socket = io(environment.backendUrl);
  }

  createSubject(event: string): Subject<MessageEvent> {
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

}
