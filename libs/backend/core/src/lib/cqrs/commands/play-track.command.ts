import { ICommand } from '@nestjs/cqrs';
import { User } from '@sdj/backend/db';

export class PlayTrackCommand implements ICommand {
  constructor(
    public link: string,
    public channelId: string,
    public addedById: string
  ) {}
}
