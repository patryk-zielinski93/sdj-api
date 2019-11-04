import { Injectable, LoggerService as LoggerServiceI } from '@nestjs/common';

@Injectable()
export abstract class LoggerService implements LoggerServiceI {
  log(message: any, context?: string): void {
    throw new Error('Method not implemented.');
  }
  error(message: any, trace?: string, context?: string): void {
    throw new Error('Method not implemented.');
  }
  warn(message: any, context?: string): void {
    throw new Error('Method not implemented.');
  }
  debug?(message: any, context?: string): void {
    throw new Error('Method not implemented.');
  }
  verbose?(message: any, context?: string): void {
    throw new Error('Method not implemented.');
  }
}
