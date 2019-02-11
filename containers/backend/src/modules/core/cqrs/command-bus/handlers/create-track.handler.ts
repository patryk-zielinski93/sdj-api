import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RedisService } from '../../../services/redis.service';
import { PlaylistStore } from '../../../store/playlist.store';
import { CreateTrackCommand } from "../commands/create-track.command";
import * as requestPromise from "request-promise-native";
import { connectionConfig } from "../../../../../configs/connection.config";
import { VideoMetadata } from "../../../../slack/bot/lib/interfaces/video-metadata.interface";
import { YoutubeIdError } from "../../../../slack/bot/lib/errors/youtube-id.error";
import * as parseIsoDuration from 'parse-iso-duration';
import { User } from "../../../modules/db/entities/user.model";
import { Track } from "../../../modules/db/entities/track.model";
import { TrackStatus } from "../../../enums/track-status.enum";
import { TrackRepository } from "../../../modules/db/repositories/track.repository";
import { InjectRepository } from '@nestjs/typeorm';
import { Mp3Service } from "../../../services/mp3.service";


@CommandHandler(CreateTrackCommand)
export class CreateTrackHandler implements ICommandHandler<CreateTrackCommand> {
    constructor(private readonly mp3: Mp3Service,
                private readonly publisher: EventBus,
                private redisService: RedisService,
                private readonly playlistStore: PlaylistStore,
                @InjectRepository(TrackRepository) private trackRepository: TrackRepository) {
    }

    async execute(command: CreateTrackCommand, resolve: (value?) => void) {
        const id = command.id;
        const res = await requestPromise.get(
            `https://www.googleapis.com/youtube/v3/videos?id=${id}&part=contentDetails,snippet&key=${connectionConfig.youtube.apiKey}`
        );
        const metadata: VideoMetadata = JSON.parse(res).items[0];

        if (!metadata) {
            throw new YoutubeIdError(`Id '${id}' is invalid or there was issue with fetching Youtube API.`);
        }

        if (metadata.contentDetails && metadata.contentDetails.regionRestriction &&
            metadata.contentDetails.regionRestriction.blocked &&
            metadata.contentDetails.regionRestriction.blocked.indexOf('PL') !== -1) {
            throw new Error('blocked');
        }

        if (parseIsoDuration(metadata.contentDetails.duration) > 7 * 60 * 1000) {
            throw new Error('video too long');
        }

        const track = this.prepareTrack(metadata, command.addedBy);
        await this.trackRepository.save(track);

        this.mp3.downloadAndNormalize(id).subscribe(async duration => {
            track.duration = parseInt(duration, 10);
            track.createdAt = new Date();
            this.trackRepository.save(track);
        }, () => {
            console.log('Can\'t download track ' + track.id);
        });
        resolve(track);
    }


    private prepareTrack(metadata: VideoMetadata, addedBy: User): Track {
        const track = new Track();
        track.id = metadata.id;
        track.status = TrackStatus.Downloading;
        track.title = metadata.snippet.title;
        track.duration = 0;
        track.createdAt = new Date();
        track.addedBy = addedBy;

        return track;
    }

}
