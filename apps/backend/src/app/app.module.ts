import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlackModule } from './modules/slack/slack.module';
import { WebSocketModule } from './modules/web-socket/web-socket.module';
import { CoreModule } from './modules/core/core.module';
import { ApiModule } from './modules/api/api.module';

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
