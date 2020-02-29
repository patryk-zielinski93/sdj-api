import { ICommand } from '@nestjs/cqrs';

export class ThumbDownCommand implements ICommand {
  constructor(public queuedTrackId: number, public userId: string) {}
}
