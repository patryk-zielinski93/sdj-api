import { Injectable } from '@angular/core';
import { WebSocketClient } from '@sdj/ng/core/shared/port';
import { WebSocketEvents } from '@sdj/shared/domain';

@Injectable({ providedIn: 'root' })
export class JoinHandler {
  constructor(private ws: WebSocketClient) {}

  execute({ channelId }): void {
    this.ws.emit(WebSocketEvents.join, { room: channelId });
  }
}
