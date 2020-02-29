import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { BackendRadioShellModule } from '@sdj/backend/radio/shell';
import { AppController } from './controllers/app.controller';
import { TrackResolver } from './controllers/track.resolver';

@Module({
  imports: [
    BackendRadioShellModule,
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql'
    })
  ],
  controllers: [AppController],
  providers: [TrackResolver]
})
export class ApiModule {}
