import { Global, Module } from '@nestjs/common';
import { LoggerModule } from '@sdj/backend/shared/logger';
import { TypeOrmRootModule } from './type-orm-root.module';

@Global()
@Module({
  imports: [TypeOrmRootModule, LoggerModule],
  exports: [TypeOrmRootModule, LoggerModule]
})
export class BackendSharedCoreModule {}
