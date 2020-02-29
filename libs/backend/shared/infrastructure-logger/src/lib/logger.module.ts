import { Module } from '@nestjs/common';
import { DefaultLogger } from './services/default.logger.service';
import { LoggerService } from './services/logger.service';

const logger = {
  provide: LoggerService,
  useClass: DefaultLogger
};
@Module({ providers: [logger], exports: [logger] })
export class LoggerModule {}
