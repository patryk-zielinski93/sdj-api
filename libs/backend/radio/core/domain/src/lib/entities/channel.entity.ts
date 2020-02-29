import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { QueuedTrack } from './queued-track.entity';

@Entity()
export class Channel {
  @PrimaryColumn('varchar')
  id: string;

  @Column('varchar', {
    length: 200,
    nullable: true
  })
  name: string;

  @Column('varchar', {
    length: 200,
    nullable: true
  })
  defaultStreamUrl: string;

  @OneToMany(
    type => QueuedTrack,
    queuedTrack => queuedTrack.track
  )
  queuedTracks: Promise<QueuedTrack[]>;
}
