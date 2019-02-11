import { Module } from '@nestjs/common';
import { WebSocketModule } from '../web-socket/web-socket.module';
import { Bot } from './bot/lib/bot';
import { CleanShitSlackCommand } from './bot/lib/commands/clean-shit.slack-command';
import { LsSlackCommand } from './bot/lib/commands/ls.slack-command';
import { PlayTrackSlackCommand } from './bot/lib/commands/play-track.slack-command';
import { PozdroSlackCommand } from './bot/lib/commands/pozdro.slack-command';
import { RandSlackCommand } from './bot/lib/commands/rand.slack-command';
import { RefreshSlackCommand } from './bot/lib/commands/refresh.slack-command';
import { ThumbDownSlackCommand } from './bot/lib/commands/thumb-down.slack-command';
import { ThumbUpSlackCommand } from './bot/lib/commands/thumb-up.slack-command';
import { SlackService } from './services/slack.service';

@Module({
    imports: [
        WebSocketModule
    ],
    providers: [
        Bot,
        CleanShitSlackCommand,
        LsSlackCommand,
        PlayTrackSlackCommand,
        PozdroSlackCommand,
        RandSlackCommand,
        RefreshSlackCommand,
        ThumbUpSlackCommand,
        ThumbDownSlackCommand,
        SlackService
    ]
})
export class SlackModule {
}
