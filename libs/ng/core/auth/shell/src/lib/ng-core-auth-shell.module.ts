import { NgModule } from '@angular/core';
import { NgCoreAuthApplicationServicesModule } from '@sdj/ng/core/auth/application-services';
import { TokenRepository } from '@sdj/ng/core/auth/domain-services';
import {
  NgCoreAuthInfrastructureModule,
  TokenRepositoryAdapter
} from '@sdj/ng/core/auth/infrastructure';

@NgModule({
  imports: [
    NgCoreAuthApplicationServicesModule,
    NgCoreAuthInfrastructureModule
  ],
  providers: [{ provide: TokenRepository, useClass: TokenRepositoryAdapter }]
})
export class NgCoreAuthShellModule {}
