import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

const typeOrmModule = TypeOrmModule.forRoot({
  type: 'mysql',
  synchronize: true,
  host: 'database',
  port: 3306,
  username: 'sdj',
  password: 'sdj123123',
  database: 'slack_dj',
  autoLoadEntities: true
});

@Module({
  imports: [typeOrmModule],
  exports: [typeOrmModule]
})
export class TypeOrmRootModule {}
