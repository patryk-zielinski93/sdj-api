import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgCoreSharedInfrastructureApolloModule } from '@sdj/ng/core/shared/infrastructure-apollo';

@NgModule({
  imports: [
    HttpClientModule,
    NgCoreSharedInfrastructureApolloModule,
    BrowserAnimationsModule,
    BrowserModule,
    RouterModule.forRoot([])
  ],
  providers: [],
  exports: [RouterModule]
})
export class NgCoreSharedKernelModule {}
