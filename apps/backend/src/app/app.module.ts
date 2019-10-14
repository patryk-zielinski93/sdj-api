import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiModule } from '@sdj/backend/api';
import { WebSocketModule } from '@sdj/backend/websocket';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      installSubscriptionHandlers: true
    }),
    ApiModule,
    WebSocketModule
  ]
})
export class AppModule {}
