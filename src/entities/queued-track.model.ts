import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Track } from './track.model';

@Entity()
export class QueuedTrack {
  @Column('varchar', {
    length: 100
  })
  addedBy: string;
  @PrimaryGeneratedColumn()
  id?: number;
  @Column('int')
  order: number;
  @ManyToOne(type => Track)
  @JoinColumn()
  track: Track;
}
