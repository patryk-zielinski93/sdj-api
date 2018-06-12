import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AppSettingType } from '../enums/app-setting-type.enum';

@Entity()
export class AppSetting {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('varchar')
  type: AppSettingType;
  @Column('varchar')
  value: string;
}
