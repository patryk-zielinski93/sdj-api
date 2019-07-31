import { Module } from '@nestjs/common';
import { LoggerModule } from '@sdj/backend/logger';

@Module({ imports: [LoggerModule], exports: [LoggerModule] })
export class CommonModule {}
