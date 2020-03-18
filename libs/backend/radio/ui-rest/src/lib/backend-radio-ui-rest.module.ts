import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { BackendRadioShellModule } from '@sdj/backend/radio/shell';
import { AppController } from './controllers/app.controller';
import { ChannelController } from './controllers/channel.controller';
import { TrackResolver } from './controllers/track.resolver';

@Module({
  imports: [
    BackendRadioShellModule,
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql'
    })
  ],
  controllers: [AppController, ChannelController],
  providers: [TrackResolver]
})
export class BackendRadioUiRestModule {}
