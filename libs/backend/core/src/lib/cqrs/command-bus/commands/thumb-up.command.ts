import { ICommand } from '@nestjs/cqrs';

export class ThumbUpCommand implements ICommand {
  constructor(public queuedTrackId: number, public userId: string) {}
}
