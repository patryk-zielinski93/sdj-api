import { ICommand } from '@nestjs/cqrs';

export class PlaySilenceEvent implements ICommand {
  constructor(public channelId: string) {}
}
