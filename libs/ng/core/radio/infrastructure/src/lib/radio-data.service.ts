import { Injectable } from '@angular/core';
import { WebSocketClientAdapter } from '@sdj/ng/core/shared/infrastructure-web-socket';
import { WebSocketEvents } from '@sdj/shared/domain';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RadioDataService {
  constructor(private ws: WebSocketClientAdapter) {}

  getPlayDj(): Observable<void> {
    return this.ws.observe(WebSocketEvents.playDj);
  }

  getPlayRadio(): Observable<void> {
    return this.ws.observe(WebSocketEvents.playRadio);
  }
}
