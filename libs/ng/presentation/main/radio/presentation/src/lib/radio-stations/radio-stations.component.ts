import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  ExternalRadioEntity,
  ExternalRadioGroup
} from '@sdj/ng/core/radio/domain';

@Component({
  selector: 'sdj-radio-stations',
  templateUrl: './radio-stations.component.html',
  styleUrls: ['./radio-stations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadioStationsComponent {
  externalRadioGroups: ExternalRadioGroup[];

  constructor(
    private dialogRef: MatDialogRef<RadioStationsComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.externalRadioGroups = data.externalRadioGroups;
  }

  select(externalRadio: ExternalRadioEntity): void {
    this.dialogRef.close(externalRadio);
  }
}
