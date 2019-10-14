import { Module } from '@nestjs/common';
import { CoreModule } from '@sdj/backend/core';
import { AppController } from './controllers/app.controller';
import { TrackResolver } from './controllers/track.resolver';

@Module({
  imports: [CoreModule],
  controllers: [AppController],
  providers: [TrackResolver]
})
export class ApiModule {}
