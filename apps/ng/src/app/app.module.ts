import { NgModule } from '@angular/core';
import { NgCoreSharedKernelModule } from '@sdj/ng/core/shared/kernel';
import { NgPresentationMainShellModule } from '@sdj/ng/presentation/main/shell';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [NgPresentationMainShellModule, NgCoreSharedKernelModule],

  bootstrap: [AppComponent]
})
export class AppModule {}
