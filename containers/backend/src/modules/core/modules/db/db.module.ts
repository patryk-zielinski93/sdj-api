import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueuedTrack } from './entities/queued-track.model';
import { Track } from './entities/track.model';
import { User } from './entities/user.model';
import { Vote } from './entities/vote.model';
import { QueuedTrackRepository } from './repositories/queued-track.repository';
import { TrackRepository } from './repositories/track.repository';
import { UserRepository } from './repositories/user.repository';
import { VoteRepository } from './repositories/vote.repository';

@Module({
    imports: [TypeOrmModule.forFeature([
        QueuedTrack,
        QueuedTrackRepository,
        Track,
        TrackRepository,
        User,
        UserRepository,
        Vote,
        VoteRepository
    ])]
})
export class DbModule {
}
