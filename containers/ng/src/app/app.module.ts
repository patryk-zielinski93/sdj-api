import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './modules/shared/shared.module';
import { MainModule } from './modules/main/main.module';
import { CoreModule } from './modules/core/core.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    CoreModule,
    MainModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
