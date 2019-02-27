import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { appConfig } from '../../../configs/app.config';
import { TellCommand } from '../../web-socket/cqrs/command-bus/commands/tell.command';
import { QueueTrackCommand } from '../cqrs/command-bus/commands/queue-track.command';
import { PlaylistType } from '../enums/playlist-type.enum';
import { QueuedTrack } from '../modules/db/entities/queued-track.model';
import { Track } from '../modules/db/entities/track.model';
import { QueuedTrackRepository } from '../modules/db/repositories/queued-track.repository';
import { TrackRepository } from '../modules/db/repositories/track.repository';
import { UserRepository } from '../modules/db/repositories/user.repository';

@Injectable()
export class PlaylistService {
    type: PlaylistType = PlaylistType.radio;
    index = 10;
    list: Track[] = [];

    constructor(
        private readonly commandBus: CommandBus,
        @InjectRepository(TrackRepository) private trackRepository: TrackRepository,
        @InjectRepository(QueuedTrackRepository) private queuedTrackRepository: QueuedTrackRepository,
        @InjectRepository(UserRepository) private userRepository: UserRepository
    ) {
    }

    async getNext(): Promise<QueuedTrack | undefined> {
        const queuedTrack = await this.queuedTrackRepository.getNextSongInQueue();
        if (queuedTrack) {
            return queuedTrack;
        } else {
            switch (this.type) {
                case PlaylistType.mostPlayed:
                    return this.getNextForMostPlayed();
                case PlaylistType.topRated:
                    return this.getNextForTopRated();
                case PlaylistType.radio:
                default:
                    const tracksInDb = await this.trackRepository.countTracks();
                    if (tracksInDb >= appConfig.trackLengthToStartOwnRadio) {
                        const randTrack = await this.trackRepository.getRandomTrack();
                        return this.commandBus.execute(new QueueTrackCommand(randTrack.id, undefined, true));
                    }
                    break;
            }
        }
    }

    async getNextForMostPlayed(): Promise<QueuedTrack | undefined> {
        if (!this.list.length) {
            this.list = await this.trackRepository.findWeeklyMostPlayedTracks(0, 10);
        }
        this.index--;
        if (this.index < 0) {
            this.type = PlaylistType.radio;
            return;
        }
        this.commandBus.execute(new TellCommand('Numer ' + (this.index + 1)));
        return this.queuedTrackRepository.queueTrack(this.list[this.index]);
    }

    async getNextForTopRated(): Promise<QueuedTrack | undefined> {
        if (!this.list.length) {
            this.list = await this.trackRepository.findWeeklyTopRatedTracks(0, 10);
        }
        this.index--;
        if (this.index < 0) {
            this.type = PlaylistType.radio;
            return;
        }
        this.commandBus.execute(new TellCommand('Numer ' + (this.index + 1)));
        return this.queuedTrackRepository.queueTrack(this.list[this.index]);
    }

    removeQueuedTrack(queuedTrack: QueuedTrack): Promise<QueuedTrack> {
        return this.queuedTrackRepository.remove(queuedTrack);
    }
}
