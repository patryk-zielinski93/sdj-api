import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CustomMaterialModule } from '../custom-material/custom-material.module';

@NgModule({
  declarations: [],
  imports: [CommonModule,
    CustomMaterialModule,
    RouterModule
  ],
  exports: [
    CustomMaterialModule,
    RouterModule
  ]
})
export class SharedModule {}
