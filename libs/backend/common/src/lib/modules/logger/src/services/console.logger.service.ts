import { LoggerService } from './logger.service';

// tslint:disable: no-console
export class ConsoleLogger extends LoggerService {
  log(message: any, context?: string): void {
    console.log(message);
  }
  error(message: any, trace?: string, context?: string): void {
    console.error(message, trace, context);
  }
  warn(message: any, context?: string): void {
    console.warn(message, context);
  }
}
