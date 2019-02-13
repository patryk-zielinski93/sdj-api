import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Track } from './track.model';
import { User } from './user.model';
import { Vote } from './vote.model';

@Entity()
export class QueuedTrack {

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

    @Column({
        default: false
    })
    randomized: boolean;

    @ManyToOne(type => Track, track => track.queuedTracks, { eager: true })
    @JoinColumn()
    track: Track;

    @OneToMany(type => Vote, (vote: Vote) => vote.track)
    votes: Vote[];

}
