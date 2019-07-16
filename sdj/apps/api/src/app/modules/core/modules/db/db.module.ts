import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChannelRepository } from './repositories/channel.repository';
import { QueuedTrackRepository } from './repositories/queued-track.repository';
import { TrackRepository } from './repositories/track.repository';
import { UserRepository } from './repositories/user.repository';
import { VoteRepository } from './repositories/vote.repository';
import { Channel } from './entities/channel.entity';
import { QueuedTrack } from './entities/queued-track.entity';
import { Track } from './entities/track.entity';
import { User } from './entities/user.entity';
import { Vote } from './entities/vote.entity';

const Repositories = [
  ChannelRepository,
  QueuedTrackRepository,
  TrackRepository,
  UserRepository,
  VoteRepository
];

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Channel,
      ChannelRepository,
      QueuedTrack,
      QueuedTrackRepository,
      Track,
      TrackRepository,
      User,
      UserRepository,
      Vote,
      VoteRepository
    ])
  ],
  providers: [...Repositories],
  exports: [...Repositories]
})
export class DbModule {}
