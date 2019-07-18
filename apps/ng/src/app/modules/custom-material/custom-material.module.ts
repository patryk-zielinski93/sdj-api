import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatButtonToggleModule,
  MatIconModule,
  MatListModule,
  MatSidenavModule,
  MatToolbarModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatListModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule
  ],

  exports: [
    BrowserAnimationsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatListModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule
  ]
})
export class CustomMaterialModule {}
