import { OnGatewayConnection, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { QueuedTrack } from '../shared/modules/db/entities/queued-track.model';
import { WebSocketService } from './services/web-socket.service';

@WebSocketGateway()
export class Gateway implements OnGatewayConnection, OnGatewayInit {
  @WebSocketServer() server;

  constructor(private service: WebSocketService) {
  }

  afterInit(server): any {
    this.service.playDj
      .subscribe((queuedTrack: QueuedTrack) => {
        this.server.of('/').emit('play_dj', queuedTrack);
      });

    this.service.playRadio
      .subscribe(() => {
        this.server.of('/').emit('play_radio');
      })
  }

  handleConnection(client, ...args: any[]): any {
  }

  @SubscribeMessage('events')
  findAll(client, data): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
  }
}
