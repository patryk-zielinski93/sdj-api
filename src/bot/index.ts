import { Bot } from './lib/bot';
import { CleanShitCommand } from './lib/commands/clean-shit.command';
import { LsCommand } from './lib/commands/ls.command';
import { PlayTrackCommand } from './lib/commands/play-track.command';
import { PozdroCommand } from './lib/commands/pozdro.command';
import { RandCommand } from './lib/commands/rand.command';
import { RefreshCommand } from './lib/commands/refresh.command';
import { VoteForNextSongCommand } from './lib/commands/vote-for-next-song.command';

export function initializeBot(): void {
  const bot = Bot.getInstance();

  bot.addCommand(new PlayTrackCommand());
  bot.addCommand(new LsCommand());
  bot.addCommand(new PozdroCommand());
  bot.addCommand(new CleanShitCommand());
  bot.addCommand(new RandCommand());
  bot.addCommand(new RefreshCommand());
  bot.addCommand(new VoteForNextSongCommand());

  bot.start();
}
