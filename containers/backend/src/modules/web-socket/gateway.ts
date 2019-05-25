import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { from, Observable, of } from 'rxjs';
import { concatMap, delay, filter, switchMap } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
import { QueuedTrack } from '../core/modules/db/entities/queued-track.model';
import { WebSocketService } from '../core/services/web-socket.service';
import { PlaylistStore } from '../core/store/playlist.store';

@WebSocketGateway()
export class Gateway implements OnGatewayConnection {
    @WebSocketServer() server: Server;

    constructor(private service: WebSocketService, private readonly playlistStore: PlaylistStore) {
    }

    handleConnection(client, ...args: any[]): any {
    }

    @SubscribeMessage('events')
    findAll(client, data): Observable<WsResponse<number>> {
        return from([1, 2, 3])
            .pipe(
                concatMap(x => of({ event: 'events', data: x })
                    .pipe(
                        filter(x => x.data !== 2),
                        delay(2000)
                    )
                )
            );
    }

    @SubscribeMessage('join')
    join(client: Socket, data: string): void {
        const oldRoom = Object.keys(client.rooms).filter(item => item != client.id);
        oldRoom.forEach((room) => client.leave(room));
        const room = JSON.parse(data).room;
        client.join(room);
        this.server.in(room)
            .emit('newUser', 'New Player in ' + room);
        return;
    }

    @SubscribeMessage('queuedTrackList')
    onQueuedTrackList(client, data): Observable<WsResponse<QueuedTrack[]>> {
        const queue = this.playlistStore.getQueue();
        return queue.pipe(switchMap(list => {
            return of({ event: 'queuedTrackList', data: list });
        }));
    }
}
