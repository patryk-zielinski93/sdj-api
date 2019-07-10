import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { from, Observable, of } from 'rxjs';
import { concatMap, delay, filter, switchMap } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
import { QueuedTrack } from '../core/modules/db/entities/queued-track.entity';
import { HostService } from '../core/services/host.service';
import { WebSocketService } from '../core/services/web-socket.service';
import { PlaylistStore } from '../core/store/playlist.store';

@WebSocketGateway()
export class Gateway implements OnGatewayConnection {
    @WebSocketServer() server: Server;

    constructor(private service: WebSocketService, private readonly playlistStore: PlaylistStore) {
    }

    handleConnection(client, ...args: any[]): any {
    }

    @SubscribeMessage('join')
    async join(client: Socket, data: string): Promise<void> {
        const room = JSON.parse(data).room;
        if (!client.rooms[room]) {
            if (!this.server.sockets.adapter.rooms[room]) {
                HostService.startRadioStream(room)
                    .then(() => {
                        this.server.in(room)
                            .emit('roomIsRunning');
                    });
            } else {
                this.server.in(room)
                    .emit('roomIsRunning');
            }
            const oldRoom = Object.keys(client.rooms).filter(item => item != client.id);
            oldRoom.forEach((room) => {
                client.leave(room);
                if (!this.server.sockets.adapter.rooms[room]) {
                    HostService.removeRadioStream(room);
                }
            });
            client.join(room);
            this.server.in(room)
                .emit('newUser', 'New Player in ' + room);
        }
        return;
    }

    @SubscribeMessage('queuedTrackList')
    onQueuedTrackList(client, data): Observable<WsResponse<QueuedTrack[]>> {
        const queue = this.playlistStore.getQueue(JSON.parse(data));
        return queue.pipe(switchMap(list => {
            return of({ event: 'queuedTrackList', data: list });
        }));
    }
}
