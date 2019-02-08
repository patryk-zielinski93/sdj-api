import { Module, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CommandBus, CQRSModule, EventBus } from '@nestjs/cqrs';
import { DownloadAndPlayHandler } from './cqrs/command-bus/handlers/download-and-play.handler';
import { DownloadTrackHandler } from './cqrs/command-bus/handlers/download-track.handler';
import { SetNextSongHandler } from './cqrs/command-bus/handlers/set-next-song.handler';
import { RedisSagas } from './cqrs/events/sagas/redis.sagas';
import { DbModule } from './modules/db/db.module';
import { IcesService } from './services/ices.service';
import { Mp3Service } from './services/mp3.service';
import { PlaylistService } from './services/playlist.service';
import { RedisService } from './services/redis.service';
import { WebSocketService } from './services/web-socket.service';
import { PlaylistStore } from './store/playlist.store';

export const CommandHandlers = [DownloadAndPlayHandler, DownloadTrackHandler, SetNextSongHandler];

@Module({
    imports: [
        DbModule,
        CQRSModule
    ],
    providers: [
        ...CommandHandlers,
        IcesService,
        Mp3Service,
        PlaylistService,
        PlaylistStore,
        RedisSagas,
        RedisService,
        WebSocketService
    ],
    exports: [
        IcesService,
        Mp3Service,
        PlaylistService,
        RedisService,
        WebSocketService
    ]
})
export class SharedModule implements OnModuleInit {
    constructor(
        private readonly moduleRef: ModuleRef,
        private readonly command$: CommandBus,
        private readonly event$: EventBus,
        private readonly redisSagas: RedisSagas
    ) {
    }

    onModuleInit(): any {
        this.command$.setModuleRef(this.moduleRef);
        this.event$.setModuleRef(this.moduleRef);

        this.command$.register(CommandHandlers);
        this.event$.combineSagas([
            this.redisSagas.getNext
        ]);
    }
}
