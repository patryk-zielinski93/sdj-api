import { DbService } from '../../services/db.service';
import { Mp3Service } from '../../services/mp3.service';
import { SlackService } from '../../services/slack.service';
import { Command } from './interfaces/command.iterface';

export class Bot {
  private static instance: Bot;
  private commands: { [key: string]: Command[] } = {};
  private db: DbService;
  private mp3: Mp3Service;
  private slack: SlackService;

  static getInstance(): Bot {
    return this.instance || (this.instance = new this());
  }

  private constructor() {
    this.db = DbService;
    this.mp3 = Mp3Service.getInstance();
    this.slack = SlackService.getInstance();
    this.handleMessage = this.handleMessage.bind(this);
  }

  addCommand(command: Command): void {
    let commands = this.commands[command.type];

    if (!commands) {
      commands = this.commands[command.type] = [];
    }

    commands.push(command);
  }

  getHelpMessage(user: string): string {
    let helpMsg = `Cześć <@${user}>! Coś źle mi wstukujesz :(. Łap listę poleceń!\n\n`;

    Object.keys(this.commands).forEach((key) => {
      this.commands[key].forEach(command => {
        helpMsg += `\`${command.type}\` ${command.description}\n`;
      });
    });

    return helpMsg;
  }

  handleMessage(message: any): void {
    if (!message.user || message.type !== 'message' || message.subtype === 'bot_message') {
      return;
    }

    const command = message.text.split(' ');
    const commands = this.commands[command[0]];

    if (commands && commands.length) {
      commands.forEach(c => {
        c.handler(command, message).catch(e => {
          console.log(e);
          this.sendErrorMessage(message.channel);
        });
      });
    } else {
      this.slack.rtm.sendMessage(this.getHelpMessage(message.user), message.channel);
    }
  }

  start(): void {
    this.slack.rtm.on('authenticated', (rtmStartData) => {
      console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}.`);
    });

    this.slack.rtm.on('message', this.handleMessage);
  }

  private sendErrorMessage(channel: string): void {
    this.slack.rtm.sendMessage('Ups! Coś poszło nie tak :(', channel);
  }
}
