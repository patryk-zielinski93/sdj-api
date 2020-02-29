import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TrackDomainRepository } from '@sdj/backend/radio/core/domain-service';
import { pathConfig } from '@sdj/backend/shared/domain';
import { LoggerService } from '@sdj/backend/shared/infrastructure-logger';
import { downloadAndNormalize } from '@sdj/backend/shared/util-mp3';
import * as fs from 'fs';
import { throwError } from 'rxjs';
import { DeleteTrackCommand } from '../delete-track/delete-track.command';
import { DownloadTrackCommand } from './download-track.command';

@CommandHandler(DownloadTrackCommand)
export class DownloadTrackHandler
  implements ICommandHandler<DownloadTrackCommand> {
  constructor(
    private commandBus: CommandBus,
    private readonly logger: LoggerService,
    private readonly trackRepository: TrackDomainRepository
  ) {}

  async execute(command: DownloadTrackCommand): Promise<void> {
    const track = await this.trackRepository.findOneOrFail(command.trackId);
    if (!fs.existsSync(pathConfig.tracks + '/' + track.id + '.mp3')) {
      return new Promise((resolve, reject) =>
        downloadAndNormalize(track.id).subscribe({
          error: async (err: Object) => {
            this.logger.error(
              "Can't download track " + track.id,
              JSON.stringify(err)
            );
            this.logger.warn('Removing ' + track.title);
            await this.commandBus.execute(new DeleteTrackCommand(track.id));
            reject();
            throwError(new Error("Can't download track "));
          },
          complete: resolve
        })
      );
    }
  }
}
