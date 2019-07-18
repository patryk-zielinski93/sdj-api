import { Injectable } from '@nestjs/common';
import { SlackService } from '../../../services/slack.service';
import { SlackCommand } from '../interfaces/slack-command';
import { SlackMessage } from '../interfaces/slack-message.interface';

@Injectable()
export class CleanShitSlackCommand implements SlackCommand {
  description =
    '`[żeton]` specjalnie dla Ciebie usunę wszystkie utwory w kolejce (żeton kosztuje 2zł)';
  type = 'cleanShit';

  constructor(private slack: SlackService) {}

  async handler(command: string[], message: SlackMessage): Promise<void> {
    this.slack.rtm.sendMessage(
      'Nie masz wystarczającej liczby żetonów.',
      message.channel
    );
  }
}
