import { Module } from '@nestjs/common';
import { LoggerService } from './services/logger.service';
import { DefaultLogger } from './services/default.logger.service';

const logger = {
  provide: LoggerService,
  useClass: DefaultLogger
};
@Module({ providers: [logger], exports: [logger] })
export class LoggerModule {}
