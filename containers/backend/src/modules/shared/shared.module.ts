import { Module } from '@nestjs/common';
import { CQRSModule } from '@nestjs/cqrs';
import { DbModule } from './modules/db/db.module';
import { IcesService } from './services/ices.service';
import { Mp3Service } from './services/mp3.service';
import { PlaylistService } from './services/playlist.service';
import { RedisService } from './services/redis.service';
import { WebSocketService } from './services/web-socket.service';

@Module({
    imports: [
        DbModule,
        CQRSModule
    ],
    providers: [
        IcesService,
        Mp3Service,
        PlaylistService,
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
export class SharedModule {}
