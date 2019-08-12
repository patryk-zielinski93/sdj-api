import { WebSocketModule } from '@sdj/backend/websocket';
import { CoreModule } from '@sdj/backend/core';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiModule } from '@sdj/backend/api';
import { SlackModule } from '@sdj/backend/slack';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { connectionConfig } from '@sdj/backend/config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'APP',
        ...connectionConfig.microservices
      }
    ]),
    ApiModule,
    CoreModule,
    SlackModule,
    TypeOrmModule.forRoot(),
  ]
})
export class AppModule {}
