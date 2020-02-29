import { ICommand } from '@nestjs/cqrs';
import { User } from '@sdj/backend/radio/core/domain';

export class QueueTrackCommand implements ICommand {
  constructor(
    public trackId: string,
    public channelId: string,
    public addedBy?: User | undefined,
    public randomized: boolean = false
  ) {}
}
