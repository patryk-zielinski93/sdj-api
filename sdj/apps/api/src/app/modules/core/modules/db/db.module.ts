import { Module, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CommandBus } from '@nestjs/cqrs';
import { TypeOrmModule, InjectRepository } from '@nestjs/typeorm';

import { DeleteTrackHandler } from './cqrs/command-bus/handlers/DeleteTrackHandler';
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

export const CommandHandlers = [DeleteTrackHandler];
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
  providers: [...CommandHandlers],
  exports: [typeormModule]
})
export class DbModule {
}
