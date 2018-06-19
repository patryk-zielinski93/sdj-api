import { SlackService } from '../../../services/slack.service';
import { Command } from '../interfaces/command.iterface';

export class CleanShitCommand implements Command {
  description = '`[żeton]` - specjalnie dla Ciebie usunę wszystkie utwory w kolejce (żeton kosztuje 2zł)';
  type = 'cleanShit';

  async handler(command: string[], message: any): Promise<any> {
    const slack = SlackService.getInstance();
    slack.rtm.sendMessage('Nie masz wystarczającej liczby żetonów.', message.channel);
  }
}
