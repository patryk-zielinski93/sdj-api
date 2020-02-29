import { Module } from '@nestjs/common';
import { BackendRadioUiRedisModule } from '@sdj/backend/radio/ui-redis';
import { BackendRadioUiRestModule } from '@sdj/backend/radio/ui-rest';
import { SlackModule } from '@sdj/backend/radio/ui-slack';
import { WebSocketModule } from '@sdj/backend/radio/ui-web-socket';
import { BackendSharedCoreModule } from '@sdj/backend/shared/core';

@Module({
  imports: [
    BackendSharedCoreModule,
    BackendRadioUiRestModule,
    WebSocketModule,
    BackendRadioUiRedisModule,
    SlackModule
  ]
})
export class AppModule {}
