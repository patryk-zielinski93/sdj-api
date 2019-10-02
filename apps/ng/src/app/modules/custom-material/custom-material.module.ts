import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatButtonToggleModule,
  MatIconModule,
  MatListModule,
  MatSidenavModule,
  MatToolbarModule,
  MatBadgeModule, MatTableModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    MatBadgeModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatListModule,
    MatIconModule,
    MatSidenavModule,
    MatTableModule,
    MatToolbarModule
  ],

  exports: [
    BrowserAnimationsModule,
    MatBadgeModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatListModule,
    MatIconModule,
    MatSidenavModule,
    MatTableModule,
    MatToolbarModule
  ]
})
export class CustomMaterialModule {}
