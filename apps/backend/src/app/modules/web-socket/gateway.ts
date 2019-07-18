import {
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse
} from '@nestjs/websockets';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Rooms, Server, Socket } from 'socket.io';

import { HostService } from '../core/services/host.service';
import { WebSocketService } from '../core/services/web-socket.service';
import { PlaylistStore } from '../core/store/playlist.store';
import { QueuedTrack } from '../core/modules/db/entities/queued-track.entity';

@WebSocketGateway()
export class Gateway implements OnGatewayDisconnect {
  private roomsSnapshot: Rooms;
  @WebSocketServer() server: Server;

  constructor(
    private service: WebSocketService,
    private readonly playlistStore: PlaylistStore
  ) {}

  handleDisconnect(client, ...args: any[]): any {
    this.leaveOtherChannels(client);
  }

  @SubscribeMessage('join')
  async join(client: Socket, data: string): Promise<void> {
    const room = JSON.parse(data).room;
    if (!client.rooms[room]) {
      this.joinRoom(client, room);
      this.leaveOtherChannels(client, room);
      this.server.in(room).emit('newUser', 'New Player in ' + room);
    }
    return;
  }

  @SubscribeMessage('queuedTrackList')
  onQueuedTrackList(client, data): Observable<WsResponse<QueuedTrack[]>> {
    const queue = this.playlistStore.getQueue(JSON.parse(data));
    return queue.pipe(
      switchMap(list => {
        return of({ event: 'queuedTrackList', data: list });
      })
    );
  }

  private doRoomsSnapshot(): void {
    this.roomsSnapshot = { ...this.server.sockets.adapter.rooms };
  }

  private joinRoom(client: Socket, room: string): void {
    if (!this.server.sockets.adapter.rooms[room]) {
      HostService.startRadioStream(room);
      this.playlistStore.channelAppear(room).subscribe(() => {
        this.server.in(room).emit('roomIsRunning');
      });
    } else {
      this.server.in(room).emit('roomIsRunning');
    }
    client.join(room);
    this.doRoomsSnapshot();
  }

  private leaveOtherChannels(client: Socket, roomId?: string): void {
    const otherRoomsKeys = Object.keys(this.roomsSnapshot).filter(
      (key: string) => key !== roomId
    );
    otherRoomsKeys.forEach(room => {
      client.leave(room);
      if (!this.server.sockets.adapter.rooms[room]) {
        HostService.removeRadioStream(room);
        this.playlistStore.channelDisappears(room);
      }
    });
    this.doRoomsSnapshot();
  }
}
