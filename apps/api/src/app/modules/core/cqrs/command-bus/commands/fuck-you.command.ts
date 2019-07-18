import { ICommand } from '@nestjs/cqrs';

export class FuckYouCommand implements ICommand {
  constructor(public queuedTrackId: number, public userId: string) {}
}
