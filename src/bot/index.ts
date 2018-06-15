import { Bot } from './lib/bot';
import { LsCommand } from './lib/commands/ls.command';
import { PlayTrackCommand } from './lib/commands/play-track.command';

export function initializeBot(): void {
  const bot = Bot.getInstance();

  bot.addCommand(new PlayTrackCommand());
  bot.addCommand(new LsCommand());

  bot.start();
}
