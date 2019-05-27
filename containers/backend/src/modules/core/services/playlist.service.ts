import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { appConfig } from '../../../configs/app.config';
import { TellCommand } from '../../web-socket/cqrs/command-bus/commands/tell.command';
import { QueueTrackCommand } from '../cqrs/command-bus/commands/queue-track.command';
import { PlaylistType } from '../enums/playlist-type.enum';
import { Channel } from '../modules/db/entities/channel.entity';
import { QueuedTrack } from '../modules/db/entities/queued-track.entity';
import { Track } from '../modules/db/entities/track.entity';
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

    async getNext(channel: Channel): Promise<QueuedTrack | undefined> {
        const queuedTrack = await this.queuedTrackRepository.getNextSongInQueue(channel.id);
        if (queuedTrack) {
            return queuedTrack;
        } else {
            switch (this.type) {
                case PlaylistType.mostPlayed:
                    return this.getNextForMostPlayed(channel);
                case PlaylistType.topRated:
                    return this.getNextForTopRated(channel);
                case PlaylistType.radio:
                default:
                    const tracksInDb = await this.trackRepository.countTracks(channel.id);
                    if (tracksInDb >= appConfig.trackLengthToStartOwnRadio) {
                        const randTrack = await this.trackRepository.getRandomTrack(channel.id);
                        return this.commandBus.execute(new QueueTrackCommand(randTrack.id, undefined, true));
                    }
                    break;
            }
        }
    }

    async getNextForMostPlayed(channel: Channel): Promise<QueuedTrack | undefined> {
        if (!this.list.length) {
            this.list = await this.trackRepository.findWeeklyMostPlayedTracks(channel.id, 0, 10);
        }
        this.index--;
        if (this.index < 0) {
            this.type = PlaylistType.radio;
            return;
        }
        this.commandBus.execute(new TellCommand('Numer ' + (this.index + 1)));
        return this.queuedTrackRepository.queueTrack(this.list[this.index], channel);
    }

    async getNextForTopRated(channel: Channel): Promise<QueuedTrack | undefined> {
        if (!this.list.length) {
            this.list = await this.trackRepository.findWeeklyTopRatedTracks(channel.id, 0, 10);
        }
        this.index--;
        if (this.index < 0) {
            this.type = PlaylistType.radio;
            return;
        }
        this.commandBus.execute(new TellCommand('Numer ' + (this.index + 1)));
        return this.queuedTrackRepository.queueTrack(this.list[this.index], channel);
    }

    removeQueuedTrack(queuedTrack: QueuedTrack): Promise<QueuedTrack> {
        return this.queuedTrackRepository.remove(queuedTrack);
    }
}
