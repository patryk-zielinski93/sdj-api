import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreModule } from '@sdj/backend/core';
import { StorageController } from './controllers/storage.controller';
import { Store } from './services/store';

@Module({
  imports: [CoreModule, TypeOrmModule.forRoot({
    'type': 'mysql',
    'host': 'database',
    'port': 3306,
    'username': 'sdj',
    'password': 'sdj123123',
    'database': 'slack_dj', autoLoadEntities: true
  })],
  providers: [Store],
  controllers: [StorageController]
})
export class StorageModule {}
