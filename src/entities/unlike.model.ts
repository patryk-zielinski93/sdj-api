import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { QueuedTrack } from './queued-track.model';
import { User } from './user.model';

@Entity()
export class Unlike {
  @Column('datetime')
  addedAt: Date;
  @ManyToOne(type => User)
  @JoinColumn()
  addedBy: User;
  @PrimaryGeneratedColumn()
  id?: number;
  @ManyToOne(type => QueuedTrack)
  @JoinColumn()
  track: QueuedTrack;

  constructor(addedBy: User, track: QueuedTrack) {
    this.addedBy = addedBy;
    this.track = track;
  }
}
