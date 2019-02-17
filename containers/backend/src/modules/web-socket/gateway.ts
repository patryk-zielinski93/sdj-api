import {
    OnGatewayConnection,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse
} from '@nestjs/websockets';
import { from, Observable, of } from 'rxjs';
import { concatMap, delay, filter } from 'rxjs/operators';
import { WebSocketService } from '../core/services/web-socket.service';

@WebSocketGateway()
export class Gateway implements OnGatewayConnection {
    @WebSocketServer() server;

    constructor(private service: WebSocketService) {
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
}
