import { ICommand } from '@nestjs/cqrs';

export class AddTrackToQueueCommand implements ICommand {
  constructor(
    public link: string,
    public channelId: string,
    public addedById: string
  ) {}
}
