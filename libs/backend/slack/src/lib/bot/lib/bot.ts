import { Injectable } from '@nestjs/common';
import { SlackService } from '../../services/slack.service';
import { CleanShitSlackCommand } from './commands/clean-shit.slack-command';
import { FuckYouSlackCommand } from './commands/fuck-you.slack-command';
import { HeartSlackCommand } from './commands/heart.slack-command';
import { LsSlackCommand } from './commands/ls.slack-command';
import { PlayTrackSlackCommand } from './commands/play-track.slack-command';
import { PozdroSlackCommand } from './commands/pozdro.slack-command';
import { RandSlackCommand } from './commands/rand.slack-command';
import { RefreshSlackCommand } from './commands/refresh.slack-command';
import { ThumbDownSlackCommand } from './commands/thumb-down.slack-command';
import { ThumbUpSlackCommand } from './commands/thumb-up.slack-command';
import { SlackCommand } from './interfaces/slack-command';
import { InjectRepository } from '@nestjs/typeorm';
import { Mp3Service } from '@sdj/backend/core';
import { UserRepository, User } from '@sdj/backend/db';

@Injectable()
export class Bot {
  private commands: { [key: string]: SlackCommand[] } = {};

  constructor(
    private mp3: Mp3Service,
    private slack: SlackService,
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    cleanC: CleanShitSlackCommand,
    fuckYouC: FuckYouSlackCommand,
    heartC: HeartSlackCommand,
    lsC: LsSlackCommand,
    playtrackC: PlayTrackSlackCommand,
    pozdroC: PozdroSlackCommand,
    randC: RandSlackCommand,
    refreshC: RefreshSlackCommand,
    thumbUpC: ThumbUpSlackCommand,
    thumbDownC: ThumbDownSlackCommand
  ) {
    this.handleMessage = this.handleMessage.bind(this);
    this.init(
      cleanC,
      lsC,
      playtrackC,
      pozdroC,
      randC,
      refreshC,
      thumbUpC,
      thumbDownC,
      heartC,
      fuckYouC
    );
  }

  init(...commands: SlackCommand[]): void {
    const addCommand = this.addCommand.bind(this);
    commands.forEach(addCommand);
    this.start();
  }

  addCommand(command: SlackCommand): void {
    let commands = this.commands[command.type];

    if (!commands) {
      commands = this.commands[command.type] = [];
    }

    commands.push(command);
  }

  getHelpMessage(user: string): string {
    let helpMsg = `Cześć <@${user}>! Łap listę poleceń!\n\n`;

    Object.keys(this.commands).forEach(key => {
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
    if (
      !message.user ||
      message.type !== 'message' ||
      message.subtype === 'bot_message'
    ) {
      return;
    }

    this.userRepository.findOne(message.user).then(async (user: User) => {
      let userProfile: any;

      if (!user) {
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

        await this.userRepository.save(user);
      }

      const command = message.text.split(' ');
      const commands = this.commands[command[0]];

      if (command[0] === 'help') {
        this.slack.rtm.sendMessage(
          this.getHelpMessage(message.user),
          message.channel
        );
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
    this.slack.rtm.on('authenticated', rtmStartData => {
      console.log(
        `Logged in as ${rtmStartData.self.name} of team ${
          rtmStartData.team.name
        }.`
      );
    });

    this.slack.rtm.on('message', this.handleMessage);
  }

  private sendErrorMessage(channel: string): void {
    this.slack.rtm.sendMessage('Ups! Coś poszło nie tak :(', channel);
  }
}
