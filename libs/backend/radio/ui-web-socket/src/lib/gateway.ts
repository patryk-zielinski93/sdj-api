import {
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse
} from '@nestjs/websockets';
import { QueuedTrack } from '@sdj/backend/radio/core/domain';
import { Store } from '@sdj/backend/radio/infrastructure';
import { WebSocketEvents } from '@sdj/shared/domain';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Rooms, Server, Socket } from 'socket.io';
import { HostService } from '../../../infrastructure/src/lib/host.service';

@WebSocketGateway()
export class Gateway implements OnGatewayDisconnect {
  private clientInRommSubjects: { [key: string]: Subject<void> } = {};
  private roomsSnapshot: Rooms = {};
  @WebSocketServer() server: Server;

  constructor(private readonly storageService: Store) {}

  handleDisconnect(client: Socket, ...args: any[]): any {
    this.leaveOtherChannels(client);
  }

  @SubscribeMessage('join')
  async join(client: Socket, data: string): Promise<void> {
    const room = JSON.parse(data).room;
    if (!client.rooms[room]) {
      this.joinRoom(client, room);
      this.leaveOtherChannels(client, room);
      this.server
        .of('/')
        .emit(WebSocketEvents.channels, this.server.sockets.adapter.rooms);
    }
    return;
  }

  @SubscribeMessage(WebSocketEvents.queuedTrackList)
  onQueuedTrackList(
    client: Socket,
    channel: string
  ): Observable<WsResponse<QueuedTrack[]>> {
    if (this.clientInRommSubjects[client.id]) {
      this.clientInRommSubjects[client.id].next();
      this.clientInRommSubjects[client.id].complete();
    }
    this.clientInRommSubjects[client.id] = new Subject();
    return this.storageService.getQueue(JSON.parse(channel)).pipe(
      takeUntil(this.clientInRommSubjects[client.id]),
      map(list => {
        return { event: WebSocketEvents.queuedTrackList, data: list };
      })
    );
  }

  private doRoomsSnapshot(): void {
    this.roomsSnapshot = { ...this.server.sockets.adapter.rooms };
  }

  private joinRoom(client: Socket, room: string): void {
    const roomExisted = !this.server.sockets.adapter.rooms[room];
    client.join(room);

    if (roomExisted) {
      HostService.startRadioStream(room);
      this.storageService.channelAppears(room).then(() => {
        this.server.in(room).emit(WebSocketEvents.roomIsRunning);
      });
    } else {
      this.server.in(room).emit(WebSocketEvents.roomIsRunning);
      client.emit(WebSocketEvents.playDj);
    }
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
        this.storageService.channelDisappears(room);
      }
    });
    this.doRoomsSnapshot();
  }
}
