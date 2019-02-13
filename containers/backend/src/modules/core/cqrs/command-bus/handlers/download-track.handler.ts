import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import { pathConfig } from '../../../../../configs/path.config';
import { QueuedTrack } from '../../../modules/db/entities/queued-track.model';
import { QueuedTrackRepository } from '../../../modules/db/repositories/queued-track.repository';
import { TrackRepository } from '../../../modules/db/repositories/track.repository';
import { Mp3Service } from '../../../services/mp3.service';
import { DownloadTrackCommand } from '../commands/download-track.command';

@CommandHandler(DownloadTrackCommand)
export class DownloadTrackHandler implements ICommandHandler<DownloadTrackCommand> {
    constructor(private mp3: Mp3Service,
                @InjectRepository(QueuedTrackRepository) private queuedTrackRepository: QueuedTrackRepository,
                @InjectRepository(TrackRepository) private readonly trackRepository: TrackRepository) {
    }

    async execute(command: DownloadTrackCommand, resolve: (value?) => void) {
        const track = await this.trackRepository.findOneOrFail(command.trackId);
        if (!fs.existsSync(pathConfig.tracks + '/' + track.id + '.mp3')) {
            return this.mp3.downloadAndNormalize(track.id).subscribe(undefined, async () => {
                console.log('Can\'t download track ' + track.id);
                console.log('Removing ' + track.title);
                // TODO CASCADE DELETE
                const queuedTracks = await track.queuedTracks;
                await queuedTracks.forEach(async (qTrack: QueuedTrack) => {
                    await this.queuedTrackRepository.remove(qTrack);
                });
                this.trackRepository.remove(track);
            }, () => {
                resolve();
            });
        } else {
            resolve();
        }

    }

    updateQueuedTrackPlayedAt(queuedTrack: QueuedTrack, playedAt?: Date): Promise<QueuedTrack> {
        queuedTrack.playedAt = playedAt || new Date();

        return this.queuedTrackRepository.save(queuedTrack);
    }
}
