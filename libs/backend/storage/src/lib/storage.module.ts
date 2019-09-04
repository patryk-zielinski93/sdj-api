import { Module } from '@nestjs/common';
import { Store } from './services/store';
import { CoreModule } from '@sdj/backend/core';
import { StorageController } from './controllers/storage.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [CoreModule, TypeOrmModule.forRoot()],
  providers: [Store],
  controllers: [StorageController]
})
export class StorageModule {}
