import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { UserRepository } from '../../../../core/modules/db/repositories/user.repository';
import { TellCommand } from '../../../../web-socket/cqrs/command-bus/commands/tell.command';
import { SlackCommand } from '../interfaces/slack-command';
import { SlackMessage } from '../interfaces/slack-message.interface';

@Injectable()
export class PozdroSlackCommand implements SlackCommand {
  description = 'wyślij pozdro swoim ziomeczkom (może też być dla mamy)';
  type = 'pozdro';

  constructor(
    private userRepository: UserRepository,
    private readonly commandBus: CommandBus
  ) {}

  async handler(command: string[], message: SlackMessage): Promise<void> {
    command.shift();
    const pozdro = command.join(' ');

    if (pozdro.length > 200) {
      throw new Error('too long');
    }

    const user = await this.userRepository.findOne({ id: message.user });

    if (user) {
      console.log(user.realName + ' mowi: ' + pozdro);

      //ToDo module injection
      this.commandBus.execute(new TellCommand(pozdro));
    }
  }
}
