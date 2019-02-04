import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { appConfig } from '../../../../../configs/app.config';
import { QueuedTrack } from '../../../../shared/modules/db/entities/queued-track.model';
import { Track } from '../../../../shared/modules/db/entities/track.model';
import { QueuedTrackRepository } from '../../../../shared/modules/db/repositories/queued-track.repository';
import { TrackRepository } from '../../../../shared/modules/db/repositories/track.repository';
import { SlackService } from '../../../services/slack.service';
import { Command } from '../interfaces/command.iterface';

@Injectable()
export class RefreshCommand implements Command {
  description = 'zagram pioseneczkę, która była grana najdawniej';
  type = 'refresh';

  constructor(
    private readonly connection: Connection,
    private slack: SlackService,
    @InjectRepository(QueuedTrackRepository) private queuedTrackRepository: QueuedTrackRepository,
    @InjectRepository(TrackRepository) private trackRepository: TrackRepository
  ) {
  }

  async handler(command: string[], message: any): Promise<any> {

    const queuedTracksCount = await this.queuedTrackRepository.createQueryBuilder('queuedTrack')
      .where('queuedTrack.playedAt IS NULL')
      .andWhere('queuedTrack.addedById = :userId')
      .setParameters({ userId: message.user })
      .getCount();

    if (queuedTracksCount >= appConfig.queuedTracksPerUser) {
      this.slack.rtm.sendMessage(`Osiągnąłeś limit ${appConfig.queuedTracksPerUser} zakolejkowanych utworów.`, message.channel);
      throw new Error('zakolejkowane');
    }

    const groupedTracksQuery = this.queuedTrackRepository.createQueryBuilder()
      .select('trackId, MAX(addedAt) as addedAt')
      .groupBy('trackId');

    const oldestTrack = await this.connection.createQueryBuilder()
      .select('*')
      .from(`(${groupedTracksQuery.getQuery()})`, 'latest')
      .orderBy('latest.addedAt', 'ASC')
      .limit(1)
      .execute();

    if (oldestTrack[0] && oldestTrack[0].trackId) {
      const trackId = oldestTrack[0].trackId;
      const refreshTrack = await this.trackRepository.findOne(trackId);
      if (refreshTrack) {
        this.queueTrack(message, refreshTrack);
      }
    }
  }

  private async queueTrack(message: any, track: Track): Promise<void> {
    const queuedTrack = new QueuedTrack();
    queuedTrack.addedAt = new Date();
    queuedTrack.addedBy = message.user;
    queuedTrack.order = 0;
    queuedTrack.track = track;
    queuedTrack.randomized = true;

    await this.queuedTrackRepository.save(queuedTrack);
    this.slack.rtm.sendMessage(`Odświeżamy! Dodałem ${track.title} do playlisty :)`, message.channel);
  }
}
