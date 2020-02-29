import { ICommand } from '@nestjs/cqrs';

export class ThumbUpCommand implements ICommand {
  constructor(public channelId: string, public userId: string) {}
}
