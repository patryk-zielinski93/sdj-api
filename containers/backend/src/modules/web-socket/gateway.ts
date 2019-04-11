import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { from, Observable, of } from 'rxjs';
import { concatMap, delay, filter, switchMap } from 'rxjs/operators';
import { QueuedTrack } from '../core/modules/db/entities/queued-track.entity';
import { WebSocketService } from '../core/services/web-socket.service';
import { PlaylistStore } from '../core/store/playlist.store';

@WebSocketGateway()
export class Gateway implements OnGatewayConnection {
    @WebSocketServer() server;

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

    @SubscribeMessage('queuedTrackList')
    onQueuedTrackList(client, data): Observable<WsResponse<QueuedTrack[]>> {
        const queue = this.playlistStore.getQueue();
        return queue.pipe(switchMap(list => {
            return of({ event: 'queuedTrackList', data: list });
        }));
    }
}
