import { Global, Module } from '@nestjs/common';
import { HostServiceAdapter } from '@sdj/backend/shared/infrastructure';
import { LoggerModule } from '@sdj/backend/shared/infrastructure-logger';
import { HostService } from '@sdj/backend/shared/port';
import { TypeOrmRootModule } from './type-orm-root.module';

const Providers = [{ provide: HostService, useClass: HostServiceAdapter }];
@Global()
@Module({
  imports: [TypeOrmRootModule, LoggerModule],
  providers: Providers,
  exports: [TypeOrmRootModule, LoggerModule, ...Providers]
})
export class BackendSharedKernelModule {}
