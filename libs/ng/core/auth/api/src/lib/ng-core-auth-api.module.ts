import { NgModule } from '@angular/core';
import { NgCoreAuthShellModule } from '@sdj/ng/core/auth/shell';
import { AuthApiFacade } from './auth-api.facade';

@NgModule({
  imports: [NgCoreAuthShellModule],
  providers: [AuthApiFacade]
})
export class NgCoreAuthApiModule {}
