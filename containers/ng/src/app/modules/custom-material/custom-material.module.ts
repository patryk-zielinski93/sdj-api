import { NgModule } from '@angular/core';
import { MatButtonModule, MatButtonToggleModule, MatListModule, MatSidenavModule, MatToolbarModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    imports: [
        BrowserAnimationsModule,
        MatListModule,
        MatToolbarModule,
        MatSidenavModule,
        MatButtonModule,
        MatButtonToggleModule
    ],

    exports: [
        BrowserAnimationsModule,
        MatListModule,
        MatToolbarModule,
        MatSidenavModule,
        MatButtonModule,
        MatButtonToggleModule
    ]
})
export class CustomMaterialModule {}
