import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as parseIsoDuration from 'parse-iso-duration';
import * as querystring from 'querystring';
import * as requestPromise from 'request-promise-native';
import * as url from 'url';
import { appConfig } from '../../../../../configs/app.config';
import { connectionConfig } from '../../../../../configs/connection.config';
import { pathConfig } from '../../../../../configs/path.config';
import { TrackStatus } from '../../../../../enums/track-status.enum';
import { QueuedTrack } from '../../../../shared/modules/db/entities/queued-track.model';
import { Track } from '../../../../shared/modules/db/entities/track.model';
import { QueuedTrackRepository } from '../../../../shared/modules/db/repositories/queued-track.repository';
import { TrackRepository } from '../../../../shared/modules/db/repositories/track.repository';
import { DbService } from '../../../../shared/services/db.service';
import { Mp3Service } from '../../../../shared/services/mp3.service';
import { SlackService } from '../../../../shared/services/slack.service';
import { YoutubeIdError } from '../errors/youtube-id.error';
import { Command } from '../interfaces/command.iterface';
import { VideoMetadata } from '../interfaces/video-metadata.interface';

@Injectable()
export class PlayTrackCommand implements Command {
  description = '`[youtubeUrl]` - jeżeli chcesz żebym zapuścił Twoją pioseneczkę, koniecznie wypróbuj to polecenie';
  type = 'play';

  constructor(
    private mp3: Mp3Service,
    private slack: SlackService,
    @InjectRepository(QueuedTrackRepository) private queuedTrackRepository: QueuedTrackRepository,
    @InjectRepository(TrackRepository) private trackRepository: TrackRepository
  ) {
  }

  async handler(command: string[], message: any): Promise<any> {
    const queuedTracksCount = await this.queuedTrackRepository.countTracksInQueueFromUser(message.user);

    if (queuedTracksCount >= appConfig.queuedTracksPerUser) {
      this.slack.rtm.sendMessage(`Masz przekroczony limit ${appConfig.queuedTracksPerUser} zakolejkowanych utworów.`, message.channel);
      throw new Error('zakolejkowane');
    }

    const id = this.extractVideoIdFromYoutubeUrl(command[1].slice(1, -1));
    if (!id) {
      throw new Error('invalid url');
    }

    const track = await this.trackRepository.findOne(id);

    if (track) {
      if (fs.existsSync(pathConfig.tracks + '/' + track.id + '.mp3')) {
        return this.queueTrack(message, track);
      } else {
        await this.mp3.downloadAndNormalize(track.id);
        return this.queueTrack(message, track);
      }
    }

    return this.addNewTrack(message, id);
  }

  private async addNewTrack(message: any, id: string): Promise<void> {
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

    const track = this.prepareTrack(metadata);
    await this.trackRepository.save(track);

    this.mp3.downloadAndNormalize(id).subscribe(async duration => {
      track.duration = parseInt(duration, 10);
      track.createdAt = new Date();
      this.trackRepository.save(track);
      await this.queueTrack(message, track);
    });
  }

  private extractVideoIdFromYoutubeUrl(ytUrl: string): string {
    const u = url.parse(ytUrl);
    const query = u.query;

    if (query) {
      return <string>querystring.parse(query)['v'];
    }

    if (u.pathname) {
      return u.pathname.slice(1, 11);
    }

    return '';
  }

  private prepareTrack(metadata: VideoMetadata): Track {
    const track = new Track();
    track.id = metadata.id;
    track.status = TrackStatus.Downloading;
    track.title = metadata.snippet.title;
    track.duration = 0;
    track.createdAt = new Date();

    return track;
  }

  private async queueTrack(message: any, track: Track): Promise<void> {
    const queuedTrack = new QueuedTrack();
    queuedTrack.addedAt = new Date();
    queuedTrack.addedBy = message.user;
    queuedTrack.order = 0;
    queuedTrack.track = track;

    await this.queuedTrackRepository.save(queuedTrack);
    this.slack.rtm.sendMessage(`Dodałem ${track.title} do playlisty :)`, message.channel);
  }
}
