import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiModule } from '@sdj/backend/api';
import { IcesModule } from '@sdj/backend/ices';
import { SlackModule } from '@sdj/backend/slack';
import { WebSocketModule } from '@sdj/backend/websocket';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      'type': 'mysql',
      'host': 'database',
      'port': 3306,
      'username': 'sdj',
      'password': 'sdj123123',
      'database': 'slack_dj', autoLoadEntities: true
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql'
    }),
    ApiModule,
    WebSocketModule,
    IcesModule,
    SlackModule
  ]
})
export class AppModule {}
