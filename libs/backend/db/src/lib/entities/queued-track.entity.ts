import { QueuedTrack as IQueuedTrack } from "@sdj/shared/common";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Channel } from "./channel.entity";
import { Track } from "./track.entity";
import { User } from "./user.entity";
import { Vote } from "./vote.entity";

@Entity()
export class QueuedTrack implements IQueuedTrack {
  @Column('datetime')
  createdAt: Date;

  @ManyToOne(type => User)
  @JoinColumn()
  addedBy: User | null;

  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  order: number;

  @Column('datetime', {
    nullable: true,
    default: null
  })
  playedAt: Date;

  @ManyToOne(type => Channel, playedIn => playedIn.queuedTracks, {
    eager: true
  })
  @JoinColumn()
  playedIn: Channel;

  @Column({
    default: false
  })
  randomized: boolean;

  @ManyToOne(type => Track, track => track.queuedTracks, { eager: true })
  @JoinColumn()
  track: Track;

  @OneToMany(type => Vote, (vote: Vote) => vote.track)
  votes: Promise<Vote[]>;
}
