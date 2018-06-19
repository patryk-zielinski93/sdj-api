import * as redis from 'redis';
import { QueuedTrack } from '../../../entities/queued-track.model';
import { DbService } from '../../../services/db.service';
import { SlackService } from '../../../services/slack.service';
import { Command } from '../interfaces/command.iterface';

export class LsCommand implements Command {
  description = '- obczaj listę utworów';
  redisClient = redis.createClient({
    host: 'redis'
  });
  type = 'ls';

  getCurrentTrackId(): Promise<string | undefined> {
    return new Promise<string | undefined>((resolve, reject) => {
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
    const slack = SlackService.getInstance();

    DbService.getRepository(QueuedTrack).subscribe(async queuedTrackRepository => {
      const queuedTracks = await queuedTrackRepository.createQueryBuilder('queuedTrack')
        .leftJoinAndSelect('queuedTrack.track', 'track')
        .leftJoinAndSelect('queuedTrack.addedBy', 'user')
        .andWhere('queuedTrack.playedAt IS NULL')
        .orderBy('queuedTrack.order, queuedTrack.id', 'ASC')
        .getMany();

      let msg = '';

      const currentTrackId = await this.getCurrentTrackId();
      if (currentTrackId !== '10-sec-of-silence') {
        const currentTrack = await queuedTrackRepository.createQueryBuilder('queuedTrack')
          .leftJoinAndSelect('queuedTrack.track', 'track')
          .leftJoinAndSelect('queuedTrack.addedBy', 'user')
          .where('queuedTrack.trackId = :trackId')
          .andWhere('queuedTrack.playedAt IS NOT NULL')
          .orderBy('queuedTrack.playedAt', 'DESC')
          .setParameter('trackId', currentTrackId)
          .getOne();

        if (currentTrack) {
          msg += `Teraz gram: ${currentTrack.track.title}, dodane przez ${currentTrack.addedBy.realName}` + (currentTrack.randomized ? ' (rand)' : '') + '\n';
        }
      }

      queuedTracks.forEach((queuedTrack, index) => {
        msg += `${index + 1}. ${queuedTrack.track.title}, dodane przez ${queuedTrack.addedBy.realName}` + (queuedTrack.randomized ? ' (rand)' : '') + '\n';
      });

      if (!msg.length) {
        slack.rtm.sendMessage('Brak utworów na liście.', message.channel);
      } else {
        slack.rtm.sendMessage(msg, message.channel);
      }

    });
  }
}
