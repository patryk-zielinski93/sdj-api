import { EntityRepository, Repository } from 'typeorm';
import { Track } from '../entities/track.model';

@EntityRepository(Track)
export class TrackRepository extends Repository<Track> {

  countTracks(): Promise<number> {
    return this.createQueryBuilder('track').getCount();
  }

  getRandomTrack(): Promise<Track | undefined> {
    return this.createQueryBuilder('track')
      .orderBy('RAND()')
      .getOne();
  }
}
