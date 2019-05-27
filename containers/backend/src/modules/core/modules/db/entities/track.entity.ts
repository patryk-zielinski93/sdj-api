import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { QueuedTrack } from './queued-track.entity';
import { User } from './user.entity';

@Entity()
export class Track {

    @ManyToOne(type => User)
    @JoinColumn()
    addedBy: User | null;

    @Column('datetime')
    createdAt: Date;

    @Column('int')
    duration: number;

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

    @Column('varchar', {
        length: 200
    })
    title: string;

    @OneToMany(type => QueuedTrack, queuedTrack => queuedTrack.track)
    queuedTracks: Promise<QueuedTrack[]>;
}
