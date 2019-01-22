import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { WebSocketModule } from '../web-socket/web-socket.module';
import { Bot } from './bot/lib/bot';
import { CleanShitCommand } from './bot/lib/commands/clean-shit.command';
import { LsCommand } from './bot/lib/commands/ls.command';
import { PlayTrackCommand } from './bot/lib/commands/play-track.command';
import { PozdroCommand } from './bot/lib/commands/pozdro.command';
import { RandCommand } from './bot/lib/commands/rand.command';
import { RefreshCommand } from './bot/lib/commands/refresh.command';
import { ThumbUpCommand } from './bot/lib/commands/thumb-up.command';
import { VoteForNextSongCommand } from './bot/lib/commands/vote-for-next-song.command';

@Module({
    imports: [
        SharedModule,
        WebSocketModule
    ],
    providers: [
        Bot,
        CleanShitCommand,
        LsCommand,
        PlayTrackCommand,
        PozdroCommand,
        RandCommand,
        RefreshCommand,
        ThumbUpCommand,
        VoteForNextSongCommand
    ]
})
export class SlackModule {
}
