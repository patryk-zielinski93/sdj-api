import { Module } from '@nestjs/common';
import { LoggerModule } from './modules';

@Module({ imports: [LoggerModule], exports: [LoggerModule] })
export class CommonModule {}
