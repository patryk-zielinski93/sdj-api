import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BotResponseType } from '../enums/bot-response-type.enum';

@Entity()
export class BotResponse {
  @PrimaryGeneratedColumn()
  id?: number;
  @Column()
  message: string;
  @Column()
  type: BotResponseType;
}
