import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Channel {
    @PrimaryColumn('varchar')
    id: string;

    @Column('varchar', {
        length: 200
    })
    name: string;

    @Column('varchar', {
        length: 200
    })
    defaultStreamUrl: string;
}