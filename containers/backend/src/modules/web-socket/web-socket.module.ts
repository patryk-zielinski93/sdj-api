import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { Gateway } from './gateway';

@Module({
  imports: [SharedModule],
    providers: [Gateway],
  exports: [Gateway]
})
export class WebSocketModule {}
