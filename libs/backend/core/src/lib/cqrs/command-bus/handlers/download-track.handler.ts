import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import { throwError } from 'rxjs';
import { Mp3Service } from '../../../services/mp3.service';
import { DownloadTrackCommand } from '../commands/download-track.command';
import { TrackRepository, DeleteTrackCommand } from '@sdj/backend/db';
import { pathConfig } from '@sdj/backend/config';
import { LoggerService } from '@sdj/backend/common';

@CommandHandler(DownloadTrackCommand)
export class DownloadTrackHandler
  implements ICommandHandler<DownloadTrackCommand> {
  constructor(
    private commandBus: CommandBus,
    private mp3: Mp3Service,
    private readonly logger: LoggerService,
    @InjectRepository(TrackRepository)
    private readonly trackRepository: TrackRepository
  ) {}

  async execute(command: DownloadTrackCommand): Promise<void> {
    const track = await this.trackRepository.findOneOrFail(command.trackId);
    if (!fs.existsSync(pathConfig.tracks + '/' + track.id + '.mp3')) {
      await this.mp3.downloadAndNormalize(track.id).subscribe({
        error: async (err) => {
          this.logger.error("Can't download track " + track.id, err);
          this.logger.warn('Removing ' + track.title);
          await this.commandBus.execute(new DeleteTrackCommand(track.id));
          throwError(new Error("Can't download track "));
        },
        complete: () => {
          return;
        }
      });
      return;
    } else {
      return;
    }
  }
}
