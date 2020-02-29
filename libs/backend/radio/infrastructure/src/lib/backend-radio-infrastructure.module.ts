import { Module } from '@nestjs/common';
import { Store } from './store';

const providers = [Store];

@Module({
  providers: providers,
  exports: providers
})
export class BackendRadioInfrastructureModule {}
