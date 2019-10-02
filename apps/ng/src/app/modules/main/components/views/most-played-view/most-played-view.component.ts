import { Component } from '@angular/core';
import { Track } from '@sdj/shared/common';

@Component({
  selector: 'most-played-view',
  templateUrl: './most-played-view.component.html',
  styleUrls: ['./most-played-view.component.scss']
})
export class MostPlayedViewComponent {
  displayedColumns: string[] = ['position', 'name'];
  tracks: Track[];

}
