import { ICommand } from '@nestjs/cqrs';

export class FuckYouCommand implements ICommand {
  constructor(public channelId: string, public userId: string) {}
}
