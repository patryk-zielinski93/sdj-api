import { ICommand } from '@nestjs/cqrs';

export class PlaySilenceCommand implements ICommand {
  constructor(public channelId: string) {}
}
