import { EntityRepository, Repository } from 'typeorm';
import { QueuedTrack } from '../entities/queued-track.model';

@EntityRepository(QueuedTrack)
export class QueuedTrackRepository extends Repository<QueuedTrack> {

  countTracksInQueueFromUser(userId: string): Promise<number> {
    return this.createQueryBuilder('queuedTrack')
      .where('queuedTrack.playedAt IS NULL')
      .andWhere('queuedTrack.addedById = :userId')
      .setParameters({ userId })
      .getCount();
  }

  findQueuedTracks(): Promise<QueuedTrack[]> {
    return this.createQueryBuilder('queuedTrack')
      .leftJoinAndSelect('queuedTrack.track', 'track')
      .leftJoinAndSelect('queuedTrack.addedBy', 'user')
      .andWhere('queuedTrack.playedAt IS NULL')
      .orderBy('queuedTrack.order, queuedTrack.id', 'ASC')
      .getMany();
  }

  getCurrentTrack(): Promise<QueuedTrack | undefined> {
    return this.createQueryBuilder('queuedTrack')
      .where('queuedTrack.playedAt IS NOT NULL')
      .limit(1)
      .orderBy('addedAt', 'DESC')
      .getOne();
  }

  getCurrentTrackById(currentTrackId: string): Promise<QueuedTrack> {
    // TODO remove cheat with type
    return <Promise<QueuedTrack>>this.createQueryBuilder('queuedTrack')
      .leftJoinAndSelect('queuedTrack.track', 'track')
      .leftJoinAndSelect('queuedTrack.addedBy', 'user')
      .where('queuedTrack.trackId = :trackId')
      .andWhere('queuedTrack.playedAt IS NOT NULL')
      .orderBy('queuedTrack.playedAt', 'DESC')
      .setParameter('trackId', currentTrackId)
      .getOne();
  }

  getNextSongToPlay(): Promise<QueuedTrack | undefined> {
    return this.createQueryBuilder('queuedTrack')
    // .addSelect('max(queuedTrack.id)')
      .leftJoinAndSelect('queuedTrack.track', 'track')
      .andWhere('queuedTrack.playedAt IS NULL')
      .orderBy('queuedTrack.order, queuedTrack.id', 'ASC')
      .getOne();
  }
}
