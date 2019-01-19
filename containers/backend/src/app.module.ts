import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { SlackModule } from './modules/slack/slack.module';
import { WebSocketModule } from './modules/web-socket/web-socket.module';

@Module({
  imports: [
    SlackModule,
    TypeOrmModule.forRoot(),
    WebSocketModule
  ],
  controllers: [AppController]
})
export class AppModule {}
