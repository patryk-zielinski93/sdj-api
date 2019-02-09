import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Gateway } from '../../../gateway';
import { PlayDjEvent } from '../../../../shared/cqrs/events/play-dj.event';

@EventsHandler(PlayDjEvent)
export class PlayDjHandler implements IEventHandler<PlayDjEvent> {
    constructor(private readonly gateway: Gateway) {
    }

    handle(event: PlayDjEvent): any {
        this.gateway.server.of('/').emit('play_dj');
    }
}
