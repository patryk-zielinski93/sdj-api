import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { environment } from "@ng-environment/environment";
import { NgSharedAppCoreModule } from "@sdj/ng/shared/app/core";
import { NgShellModule } from "@sdj/ng/shell";
import { APOLLO_OPTIONS, ApolloModule } from "apollo-angular";
import { HttpLink, HttpLinkModule } from "apollo-angular-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { AppComponent } from "./app.component";

@NgModule({
  declarations: [AppComponent],
  imports: [
    ApolloModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    HttpLinkModule,
    NgShellModule,
    RouterModule.forRoot([
      {
        component: AppComponent,
        path: ''
      }
    ]),
    NgSharedAppCoreModule
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        return {
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri: environment.backendUrl + 'graphql'
          })
        };
      },
      deps: [HttpLink]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
