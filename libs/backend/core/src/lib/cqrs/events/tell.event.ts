import { IEvent } from '@nestjs/cqrs';

export class TellEvent implements IEvent {
  constructor(public readonly message: string) {}
}
