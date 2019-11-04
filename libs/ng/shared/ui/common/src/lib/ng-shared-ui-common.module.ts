import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PlayersModule } from '@sdj/ng/shared/ui/players';

@NgModule({
  imports: [CommonModule, PlayersModule],
  exports: [PlayersModule]
})
export class NgSharedUiCommonModule {}
