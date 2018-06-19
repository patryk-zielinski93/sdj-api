import * as querystring from 'querystring';
import * as requestPromise from 'request-promise-native';
import * as url from 'url';
import * as parseIsoDuration from 'parse-iso-duration';
import { appConfig } from '../../../config';
import { QueuedTrack } from '../../../entities/queued-track.model';
import { Track } from '../../../entities/track.model';
import { TrackStatus } from '../../../enums/track-status.enum';
import { DbService } from '../../../services/db.service';
import { Mp3Service } from '../../../services/mp3.service';
import { SlackService } from '../../../services/slack.service';
import { YoutubeIdError } from '../errors/youtube-id.error';
import { Command } from '../interfaces/command.iterface';
import { VideoMetadata } from '../interfaces/video-metadata.interface';

export class PlayTrackCommand implements Command {
  description = '`[youtubeUrl]` - jeżeli chcesz żebym zapuścił Twoją pioseneczkę, koniecznie wypróbuj to polecenie.';
  type = 'play';
  private mp3 = Mp3Service.getInstance();

  async handler(command: string[], message: any): Promise<any> {
    const id = this.extractVideoIdFromYoutubeUrl(command[1].slice(1, -1));
    if (!id) {
      throw new Error('invalid url');
    }
    const connection = await DbService.getConnectionPromise();
    const trackRepository = connection.getRepository(Track);
    const track = await trackRepository.findOne(id);

    if (track) {
      return this.queueTrack(message, track);
    }

    return this.addNewTrack(message, id);
  }

  private async addNewTrack(message: any, id: string): Promise<void> {
    const res = await requestPromise.get(
      `https://www.googleapis.com/youtube/v3/videos?id=${id}&part=contentDetails,snippet&key=${appConfig.youtube.apiKey}`
    );
    const metadata: VideoMetadata = JSON.parse(res).items[0];

    if (!metadata) {
      throw new YoutubeIdError(`Id '${id}' is invalid or there was issue with fetching Youtube API.`);
    }

    if (parseIsoDuration(metadata.contentDetails.duration) > 7 * 60 * 1000) {
      throw new Error('video too long');
    }

    const connection = await DbService.getConnectionPromise();
    const trackRepository = connection.getRepository(Track);
    const track = this.prepareTrack(metadata);
    await trackRepository.save(track);

    this.mp3.downloadAndNormalize(id).subscribe(async duration => {
      track.duration = parseInt(duration, 10);
      track.createdAt = new Date();
      await trackRepository.save(track);
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
    const connection = await DbService.getConnectionPromise();
    const queuedTrackRepository = connection.getRepository(QueuedTrack);
    const queuedTrack = new QueuedTrack();
    queuedTrack.addedAt = new Date();
    queuedTrack.addedBy = message.user;
    queuedTrack.order = 0;
    queuedTrack.track = track;

    await queuedTrackRepository.save(queuedTrack);
    SlackService.getInstance().rtm.sendMessage(`Dodałem ${track.title} do playlisty :)`, message.channel);
  }
}
