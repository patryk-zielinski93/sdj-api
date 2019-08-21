import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { CoreModule } from '@sdj/backend/core';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [CoreModule],
  controllers: [AppController]
})
export class ApiModule {}
