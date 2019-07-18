import { IEvent } from '@nestjs/cqrs';

export class PlayDjEvent implements IEvent {
  constructor(public channelId: string) {}
}
