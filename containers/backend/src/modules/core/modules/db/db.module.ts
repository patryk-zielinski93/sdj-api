import { Module, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CommandBus } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeleteTrackHandler } from './cqrs/command-bus/handlers/DeleteTrackHandler';
import { QueuedTrack } from './entities/queued-track.entity';
import { Track } from './entities/track.entity';
import { User } from './entities/user.entity';
import { Vote } from './entities/vote.entity';
import { QueuedTrackRepository } from './repositories/queued-track.repository';
import { TrackRepository } from './repositories/track.repository';
import { UserRepository } from './repositories/user.repository';
import { VoteRepository } from './repositories/vote.repository';

export const CommandHandlers = [DeleteTrackHandler];

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
    ])],
    providers: [DeleteTrackHandler,
        QueuedTrackRepository]
})
export class DbModule implements OnModuleInit {
    constructor(private readonly moduleRef: ModuleRef,
                private readonly command$: CommandBus) {
    }

    onModuleInit() {
        this.command$.setModuleRef(this.moduleRef);
        this.command$.register(CommandHandlers);
    }
}
