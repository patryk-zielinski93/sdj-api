import { ICommand } from '@nestjs/cqrs';
import { User } from '@sdj/backend/db';

export class QueueTrackCommand implements ICommand {
  constructor(
    public trackId: string,
    public channelId: string,
    public addedBy?: User | undefined,
    public randomized: boolean = false
  ) {}
}
