import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Track } from './track.model';
import { User } from './user.model';

@Entity()
export class QueuedTrack {
  @Column('datetime')
  addedAt: Date;
  @ManyToOne(type => User)
  @JoinColumn()
  addedBy: User;
  @PrimaryGeneratedColumn()
  id?: number;
  @Column('int')
  order: number;
  @Column('datetime', {
    nullable: true,
    default: null
  })
  playedAt: Date;
  @ManyToOne(type => Track)
  @JoinColumn()
  track: Track;
}
