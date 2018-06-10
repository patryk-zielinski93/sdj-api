import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Track {
  @Column('datetime')
  createdAt: Date;
  @Column('int')
  duration: number;
  @PrimaryColumn('varchar')
  id: string;
  @Column('int', {
    default: 0
  })
  status: number;
  @Column('varchar', {
    length: 200
  })
  title: string;
}
