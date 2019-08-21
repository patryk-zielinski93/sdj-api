import { Module } from '@nestjs/common';
import { ApiModule } from '@sdj/backend/api';
import { WebSocketModule } from '@sdj/backend/websocket';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ApiModule,
    WebSocketModule
  ]
})
export class AppModule {}
