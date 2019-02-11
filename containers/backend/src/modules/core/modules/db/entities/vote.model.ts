import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { QueuedTrack } from './queued-track.model';
import { User } from './user.model';

@Entity()
export class Vote {

    @Column('datetime')
    addedAt: Date;

    @ManyToOne(type => User)
    @JoinColumn()
    addedBy: User;

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => QueuedTrack, track => track.votes)
    @JoinColumn()
    track: QueuedTrack;

    @Column('int')
    value: number;

    constructor(addedBy: User, track: QueuedTrack, value: number) {
        this.addedBy = addedBy;
        this.track = track;
        this.value = value;
    }
}
