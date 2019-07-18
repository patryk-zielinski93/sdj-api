import { ICommand } from '@nestjs/cqrs';

export class TellCommand implements ICommand {
  constructor(public readonly message: string) {}
}
