import { Injectable } from '@nestjs/common';
import { SlackService } from '../../../services/slack.service';
import { SlackCommandHandler } from '../bot';
import { SlackCommand } from '../interfaces/slack-command';
import { SlackMessage } from '../interfaces/slack-message.interface';

@SlackCommandHandler()
@Injectable()
export class CleanShitSlackCommand implements SlackCommand {
  description: string =
    '`[żeton]` specjalnie dla Ciebie usunę wszystkie utwory w kolejce (żeton kosztuje 2zł)';
  type: string = 'cleanShit';

  constructor(private slack: SlackService) {}

  async handler(command: string[], message: SlackMessage): Promise<void> {
    this.slack.rtm.sendMessage(
      'Nie masz wystarczającej liczby żetonów.',
      message.channel
    );
  }
}
