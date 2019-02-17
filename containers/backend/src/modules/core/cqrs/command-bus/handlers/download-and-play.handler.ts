import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { QueuedTrackRepository } from '../../../modules/db/repositories/queued-track.repository';
import { RedisService } from '../../../services/redis.service';
import { DownloadAndPlayCommand } from '../commands/download-and-play.command';
import { DownloadTrackCommand } from '../commands/download-track.command';
import { PlayQueuedTrackCommand } from '../commands/play-queued-track.command';

@CommandHandler(DownloadAndPlayCommand)
export class DownloadAndPlayHandler implements ICommandHandler<DownloadAndPlayCommand> {
    constructor(private readonly commandBus: CommandBus,
                private readonly redisService: RedisService,
                @InjectRepository(QueuedTrackRepository) private queuedTrackRepository: QueuedTrackRepository) {
    }

    async execute(command: DownloadAndPlayCommand, resolve: (value?) => void) {
        const track = await command.queuedTrack.track;
        this.commandBus.execute(new DownloadTrackCommand(track.id))
            .then(() => this.commandBus.execute(new PlayQueuedTrackCommand(command.queuedTrack)));
        resolve();
    }

}
