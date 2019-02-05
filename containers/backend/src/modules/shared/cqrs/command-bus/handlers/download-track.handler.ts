import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import { pathConfig } from '../../../../../configs/path.config';
import { QueuedTrack } from '../../../modules/db/entities/queued-track.model';
import { QueuedTrackRepository } from '../../../modules/db/repositories/queued-track.repository';
import { Mp3Service } from '../../../services/mp3.service';
import { DownloadTrackCommand } from '../commands/download-track.command';

@CommandHandler(DownloadTrackCommand)
export class DownloadTrackHandler implements ICommandHandler<DownloadTrackCommand> {
    constructor(private mp3: Mp3Service,
                @InjectRepository(QueuedTrackRepository) private queuedTrackRepository: QueuedTrackRepository) {
    }

    async execute(command: DownloadTrackCommand, resolve: (value?) => void) {
        const track = command.queuedTrack.track;
        if (!fs.existsSync(pathConfig.tracks + '/' + track.id + '.mp3')) {
            return this.mp3.downloadAndNormalize(track.id).subscribe(undefined, () => {
                console.log('Can\'t download track ' + track.id);
                console.log('Removing ' + track.title);
                // TODO CASCADE DELETE
                // track.queuedTracks.forEach((qTrack: QueuedTrack) => {
                //     this.queueTrackRepository.remove(qTrack);
                // });
                // this.trackRepository.remove(track);
                this.updateQueuedTrackPlayedAt(command.queuedTrack);
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