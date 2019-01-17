import { Module } from '@nestjs/common';
import { DbService } from './services/db.service';
import { IcesService } from './services/ices.service';
import { Mp3Service } from './services/mp3.service';
import { PlaylistService } from './services/playlist.service';
import { SlackService } from './services/slack.service';

@Module({
  providers: [
    DbService,
    IcesService,
    Mp3Service,
    PlaylistService,
    SlackService
  ],
  exports: [
    DbService,
    IcesService,
    Mp3Service,
    PlaylistService,
    SlackService
  ]
})
export class SharedModule {}
