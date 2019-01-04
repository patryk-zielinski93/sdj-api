import { appConfig } from '../../../configs/app.config';
import { connectionConfig } from '../../../configs/connection.config';
import { QueuedTrack } from '../../../entities/queued-track.model';
import { Track } from '../../../entities/track.model';
import { DbService } from '../../../services/db.service';
import { SlackService } from '../../../services/slack.service';
import { Command } from '../interfaces/command.iterface';

export class RandCommand implements Command {
  description = 'wylosuję pioseneczkę i dodam do listy utworów';
  type = 'rand';

  async handler(command: string[], message: any): Promise<any> {
    const connection = await DbService.getConnectionPromise();

    const queuedTrackRepository = connection.getRepository(QueuedTrack);
    const queuedTracksCount = await queuedTrackRepository.createQueryBuilder('queuedTrack')
      .where('queuedTrack.playedAt IS NULL')
      .andWhere('queuedTrack.addedById = :userId')
      .setParameters({ userId: message.user })
      .getCount();

    if (queuedTracksCount >= appConfig.queuedTracksPerUser) {
      const slack = SlackService.getInstance();
      slack.rtm.sendMessage(`Osiągnąłeś limit ${appConfig.queuedTracksPerUser} zakolejkowanych utworów.`, message.channel);
      throw new Error('zakolejkowane');
    }


    const trackRepository = connection.getRepository(Track);
    const randTrack = await trackRepository.createQueryBuilder('track')
      .orderBy('RAND()')
      .getOne();

    if (randTrack) {
      this.queueTrack(message, randTrack);
    }
  }

  private async queueTrack(message: any, track: Track): Promise<void> {
    const connection = await DbService.getConnectionPromise();
    const queuedTrackRepository = connection.getRepository(QueuedTrack);
    const queuedTrack = new QueuedTrack();
    queuedTrack.addedAt = new Date();
    queuedTrack.addedBy = message.user;
    queuedTrack.order = 0;
    queuedTrack.track = track;
    queuedTrack.randomized = true;

    await queuedTrackRepository.save(queuedTrack);
    SlackService.getInstance().rtm.sendMessage(`Dodałem ${track.title} do playlisty :)`, message.channel);
  }
}
