import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './modules/core/core.module';
import { TokenInterceptor } from './modules/core/services/token.interceptor';
import { AwesomePlayerComponent } from './modules/main/components/awsome-player/awesome-player.component';
import { MiniPlayerComponent } from './modules/main/components/navbar/mini-player/mini-player.component';
import { NavbarComponent } from './modules/main/components/navbar/navbar.component';
import { UserProfileComponent } from './modules/main/components/navbar/user-profile/user-profile.component';
import { MainComponent } from './modules/main/main.component';
import { SharedModule } from './modules/shared/shared.module';

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        MainComponent,
        MiniPlayerComponent,
        UserProfileComponent,
        AwesomePlayerComponent
    ],
    imports: [
        AppRoutingModule,
        BrowserModule,
        CoreModule,
        HttpClientModule,
        SharedModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
