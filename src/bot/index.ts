import { Bot } from './lib/bot';
import { PlayTrackCommand } from './lib/commands/play-track.command';

export function initializeBot(): void {
  const bot = Bot.getInstance();

  bot.addCommand(new PlayTrackCommand());

  bot.start();
}
