import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NgCoreAuthApplicationServicesModule } from '@sdj/ng/core/auth/application-services';
import { TokenRepository } from '@sdj/ng/core/auth/domain-services';
import { TokenRepositoryAdapter } from '@sdj/ng/core/auth/infrastructure';

@NgModule({
  imports: [NgCoreAuthApplicationServicesModule, HttpClientModule],
  providers: [{ provide: TokenRepository, useClass: TokenRepositoryAdapter }]
})
export class NgCoreAuthShellModule {}
