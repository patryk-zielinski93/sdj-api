import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreModule } from '@sdj/backend/core';
import { StorageController } from './controllers/storage.controller';
import { Store } from './services/store';

@Module({
  imports: [CoreModule, TypeOrmModule.forRoot()],
  providers: [Store],
  controllers: [StorageController]
})
export class StorageModule {}
