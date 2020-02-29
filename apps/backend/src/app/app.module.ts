import { Module } from '@nestjs/common';
import { IcesModule } from '@sdj/backend/ices';
import { ApiModule } from '@sdj/backend/radio/ui-rest';
import { SlackModule } from '@sdj/backend/radio/ui-slack';
import { WebSocketModule } from '@sdj/backend/radio/ui-web-socket';
import { BackendSharedCoreModule } from '@sdj/backend/shared/core';

@Module({
  imports: [
    BackendSharedCoreModule,
    ApiModule,
    WebSocketModule,
    IcesModule,
    SlackModule
  ]
})
export class AppModule {}
