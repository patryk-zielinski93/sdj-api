import { Track as ITrack } from '@sdj/shared/common';
import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { QueuedTrack } from './queued-track.entity';
import { User } from './user.entity';

@ObjectType()
@Entity()
export class Track implements ITrack {
  @ManyToOne(type => User)
  @JoinColumn()
  addedBy: User | null;

  @Column('datetime')
  createdAt: Date;

  @Column('int')
  duration: number;

  @Field()
  @PrimaryColumn('varchar')
  id: string;

  @Column('int', {
    default: 0
  })
  skips: number;

  @Column('int', {
    default: 0
  })
  status: number;

  @Field()
  @Column('varchar', {
    length: 200
  })
  title: string;

  @OneToMany(type => QueuedTrack, queuedTrack => queuedTrack.track)
  queuedTracks: Promise<QueuedTrack[]>;
}
