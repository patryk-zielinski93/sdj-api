import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggerService } from '@sdj/backend/common';
import { pathConfig } from '@sdj/backend/config';
import { DeleteTrackCommand, DownloadTrackCommand, Mp3Service } from '@sdj/backend/core';
import { TrackRepository } from '@sdj/backend/db';
import * as fs from 'fs';
import { throwError } from 'rxjs';

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
      this.mp3.downloadAndNormalize(track.id).subscribe({
        error: async (err: Object) => {
          this.logger.error(
            "Can't download track " + track.id,
            JSON.stringify(err)
          );
          this.logger.warn('Removing ' + track.title);
          await this.commandBus.execute(new DeleteTrackCommand(track.id));
          throwError(new Error("Can't download track "));
        }
      });
    }
  }
}
