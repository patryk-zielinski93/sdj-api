import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { QueuedTrack } from './entities/queued-track.entity';
import { Track } from './entities/track.entity';
import { User } from './entities/user.entity';
import { Vote } from './entities/vote.entity';
import { ChannelRepository } from './repositories/channel.repository';
import { QueuedTrackRepository } from './repositories/queued-track.repository';
import { TrackRepository } from './repositories/track.repository';
import { UserRepository } from './repositories/user.repository';
import { VoteRepository } from './repositories/vote.repository';

export const Repositories = [
  ChannelRepository,
  QueuedTrackRepository,
  TrackRepository,
  UserRepository,
  VoteRepository
];
const typeormModule = TypeOrmModule.forFeature([
  Channel,
  QueuedTrack,
  Track,
  User,
  Vote,
  ...Repositories
]);

@Module({
  imports: [typeormModule],
  exports: [typeormModule]
})
export class DbModule {}
