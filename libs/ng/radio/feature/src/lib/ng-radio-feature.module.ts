import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NgSharedUiCommonModule } from "@sdj/ng/shared/ui/common";
import { RadioComponent } from "./containers/radio/radio.component";

@NgModule({
  imports: [
    CommonModule,
    NgSharedUiCommonModule,
    RouterModule.forChild([{ path: '', component: RadioComponent }])
  ],
  declarations: [RadioComponent]
})
export class NgRadioFeatureModule {}
