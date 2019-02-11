import { Injectable } from '@nestjs/common';
import { SlackService } from '../../../services/slack.service';
import { SlackCommand } from '../interfaces/slack-command';

@Injectable()
export class CleanShitSlackCommand implements SlackCommand {
  description = '`[żeton]` specjalnie dla Ciebie usunę wszystkie utwory w kolejce (żeton kosztuje 2zł)';
  type = 'cleanShit';

  constructor(private slack: SlackService) {
  }

  async handler(command: string[], message: any): Promise<any> {
    this.slack.rtm.sendMessage('Nie masz wystarczającej liczby żetonów.', message.channel);
  }
}
