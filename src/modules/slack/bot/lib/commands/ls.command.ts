import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as redis from 'redis';
import { QueuedTrackRepository } from '../../../../shared/modules/db/repositories/queued-track.repository';
import { SlackService } from '../../../../shared/services/slack.service';
import { Command } from '../interfaces/command.iterface';

@Injectable()
export class LsCommand implements Command {
  description = 'obczaj listę utworów';
  redisClient = redis.createClient({
    host: 'redis'
  });
  type = 'ls';

  constructor(private slack: SlackService,
              @InjectRepository(QueuedTrackRepository) private queuedTrackRepository: QueuedTrackRepository) {
  }

  // TODo add to redis repository
  getCurrentTrackId(): Promise<string> {
    // ToDo handle undefined
    return new Promise<string>((resolve, reject) => {
      this.redisClient.get('next_song', (err, value) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(value);
      });
    });
  }

  async handler(command: string[], message: any): Promise<any> {
    const queuedTracks = await this.queuedTrackRepository.findQueuedTracks();

    let msg = '';

    const currentTrackId = await this.getCurrentTrackId();
    if (currentTrackId !== '10-sec-of-silence') {
      const currentTrack = await this.queuedTrackRepository.getCurrentTrackById(currentTrackId);

      if (currentTrack) {
        msg += `Teraz gram: ${currentTrack.track.title}, dodane przez ${currentTrack.addedBy.realName}` + (currentTrack.randomized ? ' (rand)' : '') + '\n';
      }
    }

    queuedTracks.forEach((queuedTrack, index) => {
      msg += `${index + 1}. ${queuedTrack.track.title}, dodane przez ${queuedTrack.addedBy.realName}` + (queuedTrack.randomized ? ' (rand)' : '') + '\n';
    });

    if (!msg.length) {
      this.slack.rtm.sendMessage('Brak utworów na liście.', message.channel);
    } else {
      this.slack.rtm.sendMessage(msg, message.channel);
    }

  }
}
