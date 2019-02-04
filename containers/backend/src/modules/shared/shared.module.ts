import { Module } from '@nestjs/common';
import { DbModule } from './modules/db/db.module';
import { IcesService } from './services/ices.service';
import { Mp3Service } from './services/mp3.service';
import { PlaylistService } from './services/playlist.service';

@Module({
    imports: [DbModule],
    providers: [
        IcesService,
        Mp3Service,
        PlaylistService
    ],
    exports: [
        IcesService,
        Mp3Service,
        PlaylistService
    ]
})
export class SharedModule {}
