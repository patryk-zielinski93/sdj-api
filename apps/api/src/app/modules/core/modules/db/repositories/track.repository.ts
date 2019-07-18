import { EntityRepository, Repository, Brackets } from 'typeorm';
import { appConfig } from '../../../../../configs/app.config';
import { Track } from '../entities/track.entity';

require('datejs');

@EntityRepository(Track)
export class TrackRepository extends Repository<Track> {
  countTracks(channelId: string): Promise<number> {
    return this.createQueryBuilder('track')
      .innerJoin('track.queuedTracks', 'queuedTrack')
      .where('queuedTrack.playedIn = :channelId')
      .setParameter('channelId', channelId)
      .getCount();
  }

  findTopRatedTracks(
    channelId: string,
    index?: number,
    limit?: number
  ): Promise<Track[]> {
    const qb = this.createQueryBuilder('track')
      .innerJoin('track.queuedTracks', 'queuedTrack')
      .leftJoin('queuedTrack.votes', 'vote')
      .where('vote.value > 0')
      .andWhere('queuedTrack.playedIn = :channelId')
      .groupBy('track.id')
      .setParameter('channelId', channelId)
      .orderBy('COUNT(track.id)', 'DESC');
    if (index) {
      qb.offset(index);
      qb.limit(limit || 1);
    }
    return qb.getMany();
  }

  findWeeklyTopRatedTracks(
    channelId: string,
    index?: number,
    limit?: number
  ): Promise<Track[]> {
    const qb = this.createQueryBuilder('track')
      .innerJoin('track.queuedTracks', 'queuedTrack')
      .leftJoin('queuedTrack.votes', 'vote')
      .where('vote.value > 0')
      .andWhere('queuedTrack.playedIn = :channelId')
      .andWhere('queuedTrack.createdAt >= :weekAgo')
      .groupBy('track.id')
      .printSql()
      .orderBy('SUM(vote.value)', 'DESC')
      .setParameter('channelId', channelId)
      .setParameter(
        'weekAgo',
        Date.last()
          .week()
          .toString(appConfig.dbDateFormat)
      );
    if (index) {
      qb.offset(index);
      qb.limit(limit || 1);
    }

    return qb.getMany();
  }

  findMostPlayedTracks(
    channelId: string,
    index?: number,
    limit?: number
  ): Promise<Track[]> {
    const qb = this.createQueryBuilder('track')
      .innerJoin('track.queuedTracks', 'queuedTrack')
      .where('queuedTrack.randomized = 0')
      .andWhere('queuedTrack.playedIn = :channelId')
      .groupBy('track.id')
      .setParameter('channelId', channelId)
      .orderBy('COUNT(track.id)', 'DESC');
    if (index) {
      qb.offset(index);
      qb.limit(limit || 1);
    }
    return qb.getMany();
  }

  findWeeklyMostPlayedTracks(
    channelId: string,
    index?: number,
    limit?: number
  ): Promise<Track[]> {
    const qb = this.createQueryBuilder('track')
      .innerJoin('track.queuedTracks', 'queuedTrack')
      .where('queuedTrack.randomized = 0')
      .andWhere('queuedTrack.playedIn = :channelId')
      .andWhere('queuedTrack.createdAt >= :weekAgo')
      .groupBy('track.id')
      .orderBy('COUNT(track.id)', 'DESC')
      .setParameter('channelId', channelId)
      .setParameter(
        'weekAgo',
        Date.last()
          .week()
          .toString(appConfig.dbDateFormat)
      );
    if (index) {
      qb.offset(index);
      qb.limit(limit || 1);
    }
    return qb.getMany();
  }

  async getRandomTrack(channelId: string): Promise<Track> {
    const rawOne = await this.createQueryBuilder('track')
      .select('DISTINCT track.id, vote.id as vId, vote.value')
      .orderBy('RAND()')
      .innerJoin('track.queuedTracks', 'queuedTrack')
      .leftJoin('queuedTrack.votes', 'vote')
      .where('track.skips < ' + appConfig.skipsToBan)
      .andWhere('queuedTrack.playedIn = :channelId')
      .andWhere(
        new Brackets(qb => {
          qb.where('vote.value > 0').orWhere('vote.value IS NULL');
        })
      )
      .setParameter('channelId', channelId)
      .getRawOne();

    return this.findOneOrFail(rawOne.id);
  }
}
