import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { SlackCommand } from '../interfaces/slack-command';
import { SlackMessage } from '../interfaces/slack-message.interface';
import { UserRepository } from '@sdj/backend/db';
import { TellEvent } from '@sdj/backend/core';
import { LoggerService } from '@sdj/backend/common';

@Injectable()
export class PozdroSlackCommand implements SlackCommand {
  description: string =
    'wyślij pozdro swoim ziomeczkom (może też być dla mamy)';
  type: string = 'pozdro';

  constructor(
    private readonly logger: LoggerService,
    private userRepository: UserRepository,
    private readonly publisher: EventBus
  ) {}

  async handler(command: string[], message: SlackMessage): Promise<void> {
    command.shift();
    const pozdro = command.join(' ');

    if (pozdro.length > 200) {
      throw new Error('too long');
    }

    const user = await this.userRepository.findOne({ id: message.user });

    if (user) {
      this.logger.verbose(user.realName + ' mowi: ' + pozdro);

      this.publisher.publish(new TellEvent(pozdro));
    }
  }
}
