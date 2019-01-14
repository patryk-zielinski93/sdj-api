import * as parseIsoDuration from 'parse-iso-duration';
import * as requestPromise from 'request-promise-native';
import { YoutubeIdError } from '../bot/lib/errors/youtube-id.error';
import { VideoMetadata } from '../bot/lib/interfaces/video-metadata.interface';
import { connectionConfig } from '../configs/connection.config';

export class YoutubeService {
  private static instance: YoutubeService;

  static getInstance(): YoutubeService {
    return this.instance || (this.instance = new this());
  }

  private constructor() {
  }

  public async downloadMp3(id: string): Promise<any> {
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

    return metadata;
  }

}