import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Gateway } from '../../../gateway';
import { PlayRadioEvent } from '../../../../shared/cqrs/events/play-radio.event';

@EventsHandler(PlayRadioEvent)
export class PlayRadioHandler implements IEventHandler<PlayRadioEvent> {
    constructor(private readonly gateway: Gateway) {
    }

    handle(event: PlayRadioEvent) {
        this.gateway.server.of('/').emit('play_radio');
    }

}
