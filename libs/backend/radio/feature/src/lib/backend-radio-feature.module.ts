import { Global, Module } from '@nestjs/common';
import {
  BackendRadioCoreApplicationServicesModule,
  TrackService,
} from '@sdj/backend/radio/core/application-services';
import { BackendRadioInfrastructureModule } from '@sdj/backend/radio/infrastructure';
import { BackendRadioInfrastructureMp3GainModule } from '@sdj/backend/radio/infrastructure-mp3-gain';
import { BackendRadioInfrastructureSlackApiModule } from '@sdj/backend/radio/infrastructure-slack-api';
import { BackendRadioInfrastructureTypeormModule } from '@sdj/backend/radio/infrastructure-typeorm';
import { BackendRadioInfrastructureYoutubeApiModule } from '@sdj/backend/radio/infrastructure-youtube-api';
import { TrackServiceAdapter } from './adapters/track-service.adapter';

@Global()
@Module({
  imports: [
    BackendRadioCoreApplicationServicesModule,
    BackendRadioInfrastructureModule,
    BackendRadioInfrastructureYoutubeApiModule,
    BackendRadioInfrastructureMp3GainModule,
    BackendRadioInfrastructureTypeormModule,
    BackendRadioInfrastructureSlackApiModule,
  ],
  providers: [{ provide: TrackService, useClass: TrackServiceAdapter }],
  exports: [
    TrackService,
    BackendRadioCoreApplicationServicesModule,
    BackendRadioInfrastructureModule,
    BackendRadioInfrastructureYoutubeApiModule,
    BackendRadioInfrastructureTypeormModule,
    BackendRadioInfrastructureSlackApiModule,
  ],
})
export class BackendRadioFeatureModule {}
