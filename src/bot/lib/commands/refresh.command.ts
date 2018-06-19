import { appConfig } from '../../../config';
import { QueuedTrack } from '../../../entities/queued-track.model';
import { Track } from '../../../entities/track.model';
import { DbService } from '../../../services/db.service';
import { SlackService } from '../../../services/slack.service';
import { Command } from '../interfaces/command.iterface';

export class RefreshCommand implements Command {
  description = ' - zagram pioseneczkę, która była grana najdawniej';
  type = 'refresh';

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

    const groupedTracksQuery = queuedTrackRepository.createQueryBuilder()
      .select('trackId, MAX(addedAt) as addedAt')
      .groupBy('trackId');

    const oldestTrack = await connection.createQueryBuilder()
      .select('*')
      .from(`(${groupedTracksQuery.getQuery()})`, 'latest')
      .orderBy('latest.addedAt', 'ASC')
      .limit(1)
      .execute();

    if (oldestTrack[0] && oldestTrack[0].trackId) {
      const trackId = oldestTrack[0].trackId;
      const trackRepository = connection.getRepository(Track);
      const refreshTrack = await trackRepository.findOne(trackId);
      if (refreshTrack) {
        this.queueTrack(message, refreshTrack);
      }
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
    SlackService.getInstance().rtm.sendMessage(`Odświeżamy! Dodałem ${track.title} do playlisty :)`, message.channel);
  }
}
