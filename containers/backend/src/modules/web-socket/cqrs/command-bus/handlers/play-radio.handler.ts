import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Gateway } from '../../../gateway';
import { PlayRadioEvent } from '../../../../core/cqrs/events/play-radio.event';

@EventsHandler(PlayRadioEvent)
export class PlayRadioHandler implements IEventHandler<PlayRadioEvent> {
    constructor(private readonly gateway: Gateway) {
    }

    handle(event: PlayRadioEvent) {
        console.log(event.channelId, 'radio')
        this.gateway.server.in(event.channelId).emit('play_radio');
    }

}
