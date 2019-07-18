import { ICommand } from '@nestjs/cqrs';

export class HeartCommand implements ICommand {
  constructor(public queuedTrackId: number, public userId: string) {}
}
