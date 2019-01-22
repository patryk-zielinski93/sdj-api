import { Injectable } from '@nestjs/common';
import { User } from '../../../shared/modules/db/entities/user.model';
import { UserRepository } from '../../../shared/modules/db/repositories/user.repository';
import { Mp3Service } from '../../../shared/services/mp3.service';
import { SlackService } from '../../../shared/services/slack.service';
import { CleanShitCommand } from './commands/clean-shit.command';
import { LsCommand } from './commands/ls.command';
import { PlayTrackCommand } from './commands/play-track.command';
import { PozdroCommand } from './commands/pozdro.command';
import { RandCommand } from './commands/rand.command';
import { RefreshCommand } from './commands/refresh.command';
import { ThumbUpCommand } from './commands/thumb-up.command';
import { VoteForNextSongCommand } from './commands/vote-for-next-song.command';
import { Command } from './interfaces/command.iterface';

@Injectable()
export class Bot {
    private commands: { [key: string]: Command[] } = {};

    constructor(
        private mp3: Mp3Service,
        private slack: SlackService,
        private userRepository: UserRepository,
        cleanC: CleanShitCommand,
        lsC: LsCommand,
        playtrackC: PlayTrackCommand,
        pozdroC: PozdroCommand,
        randC: RandCommand,
        refreshC: RefreshCommand,
        thumbUpC: ThumbUpCommand,
        voteC: VoteForNextSongCommand
    ) {
        this.handleMessage = this.handleMessage.bind(this);
        this.init(cleanC, lsC, playtrackC, pozdroC, randC, refreshC, thumbUpC, voteC);
    }

    init(...commands) {
        const addCommand = this.addCommand.bind(this);
        commands.forEach(addCommand);
        this.start();
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

        this.userRepository.findOne(message.user)
            .then(async (user: User) => {
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
