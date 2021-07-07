import { ICommand } from '@nestjs/cqrs';

export class HeartCommand implements ICommand {
  constructor(public channelId: string, public userId: string) {}
}
