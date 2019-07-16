import { IEvent } from '@nestjs/cqrs';

export class RedisGetNextEvent implements IEvent {
  constructor(public channelId: string) {}
}
