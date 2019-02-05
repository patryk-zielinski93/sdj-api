import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { PlayDjCommand } from '../../../../web-socket/cqrs/command-bus/commands/play-dj.command';
import { QueuedTrack } from '../../../modules/db/entities/queued-track.model';
import { QueuedTrackRepository } from '../../../modules/db/repositories/queued-track.repository';
import { RedisService } from '../../../services/redis.service';
import { SetNextSongCommand } from '../commands/set-next-song.command';

@CommandHandler(SetNextSongCommand)
export class SetNextSongHandler implements ICommandHandler<SetNextSongCommand> {
    constructor(private readonly commandBus: CommandBus,
                private readonly redisService: RedisService,
                @InjectRepository(QueuedTrackRepository) private queuedTrackRepository: QueuedTrackRepository) {
    }

    async execute(command: SetNextSongCommand, resolve: (value?) => void) {
        const queuedTrack = command.queuedTrack;
        this.redisService.getNextSongSubject().next(queuedTrack.track.id);
        this.commandBus.execute(new PlayDjCommand());
        this.updateQueuedTrackPlayedAt(queuedTrack);
        resolve();
    }

    updateQueuedTrackPlayedAt(queuedTrack: QueuedTrack, playedAt?: Date): Promise<QueuedTrack> {
        queuedTrack.playedAt = playedAt || new Date();

        return this.queuedTrackRepository.save(queuedTrack);
    }
}