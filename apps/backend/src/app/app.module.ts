import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiModule } from '@sdj/backend/api';
import { WebSocketModule } from '@sdj/backend/websocket';

@Module({
  imports: [
    TypeOrmModule.forRoot({ synchronize: true }),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql'
    }),
    ApiModule,
    WebSocketModule
  ]
})
export class AppModule {}
