import { WebSocketModule } from '@sdj/backend/websocket';
import { CoreModule } from '@sdj/backend/core';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiModule } from '@sdj/backend/api';
import { SlackModule } from '@sdj/backend/slack';

@Module({
  imports: [
    ApiModule,
    CoreModule,
    SlackModule,
    TypeOrmModule.forRoot(),
    WebSocketModule
  ]
})
export class AppModule {}
