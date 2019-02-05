import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { QueuedTrackRepository } from '../../../modules/db/repositories/queued-track.repository';
import { RedisService } from '../../../services/redis.service';
import { DownloadAndPlayCommand } from '../commands/download-and-play.command';
import { DownloadTrackCommand } from '../commands/download-track.command';
import { SetNextSongCommand } from '../commands/set-next-song.command';

@CommandHandler(DownloadAndPlayCommand)
export class DownloadAndPlayHandler implements ICommandHandler<DownloadAndPlayCommand> {
    constructor(private readonly commandBus: CommandBus,
                private readonly redisService: RedisService,
                @InjectRepository(QueuedTrackRepository) private queuedTrackRepository: QueuedTrackRepository) {
    }

    async execute(command: DownloadAndPlayCommand, resolve: (value?) => void) {
        this.commandBus.execute(new DownloadTrackCommand(command.queuedTrack))
            .then(() => this.commandBus.execute(new SetNextSongCommand(command.queuedTrack)));
        resolve();
    }

}
