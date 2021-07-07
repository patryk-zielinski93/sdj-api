import { ICommand } from '@nestjs/cqrs';

export class ThumbDownCommand implements ICommand {
  constructor(public channelId: string, public userId: string) {}
}
