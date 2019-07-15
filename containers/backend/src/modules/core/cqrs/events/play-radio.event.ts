import { IEvent } from '@nestjs/cqrs';

export class PlayRadioEvent implements IEvent {
    constructor(public channelId: string) {
    }

}
