import { from } from 'rxjs/internal/observable/from';
import { map, switchMap } from 'rxjs/operators';
import { appConfig } from '../../configs/app.config';
import { QueuedTrack } from '../../entities/queued-track.model';
import { Unlike } from '../../entities/unlike.model';
import { User } from '../../entities/user.model';
import { DbService } from '../../services/db.service';
import { IcesService } from '../../services/ices.service';
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
    let helpMsg = `Cześć <@${user}>! Łap listę poleceń!\n\n`;

    Object.keys(this.commands).forEach((key) => {
      this.commands[key].forEach(command => {
        const typeEmiticon = command.type.startsWith(':');
        if (!typeEmiticon) {
          helpMsg += `\``;
        }

        helpMsg += `${command.type}`;
        if (!typeEmiticon) {
          helpMsg += `\``;
        }

        helpMsg += ` - ${command.description}\n`;
      });
    });

    return helpMsg;
  }

  handleMessage(message: any): void {
    if (!message.user || message.type !== 'message' || message.subtype === 'bot_message') {
      return;
    }

    DbService.getRepository(User).pipe(
      switchMap(repository => {
        return from(repository.findOne({ id: message.user })).pipe(
          map(user => {
            return {
              repository: repository,
              user: user
            };
          })
        );
      })
    ).subscribe(async data => {
      const userRepository = data.repository;
      let user = data.user;
      let userProfile: any;

      if (!data.user) {
        try {
          userProfile = await this.slack.web.users.info({
            user: message.user
          });
          userProfile = userProfile.user;

          if (!userProfile) {
            return;
          }
        } catch (e) {
          console.log(e);
          return;
        }

        user = new User();
        user.id = message.user;
        user.name = userProfile.name;
        user.displayName = userProfile.profile.display_name;
        user.realName = userProfile.profile.real_name;
        user.image192 = userProfile.profile.image_192;
        user.image24 = userProfile.profile.image_24;
        user.image32 = userProfile.profile.image_32;
        user.image48 = userProfile.profile.image_48;
        user.image512 = userProfile.profile.image_512;
        user.image72 = userProfile.profile.image_72;

        await userRepository.save(user);
      }

      const command = message.text.split(' ');
      const commands = this.commands[command[0]];

      if (command[0] === 'help') {
        this.slack.rtm.sendMessage(this.getHelpMessage(message.user), message.channel);
      }

      if (commands && commands.length) {
        commands.forEach(c => {
          c.handler(command, message).catch(e => {
            console.log(e.message);
            this.sendErrorMessage(message.channel);
          });
        });
      } else {
        // this.slack.rtm.sendMessage(this.getHelpMessage(message.user), message.channel);
      }

    });
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
