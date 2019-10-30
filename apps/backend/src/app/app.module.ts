import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiModule } from '@sdj/backend/api';
import { WebSocketModule } from '@sdj/backend/websocket';

@Module({
  imports: [
    TypeOrmModule.forRoot({ synchronize: true }),
    ApiModule,
    WebSocketModule
  ]
})
export class AppModule {}
