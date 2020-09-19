import { Pipe, PipeTransform } from '@angular/core';
import { QueuedTrack } from '@sdj/backend/radio/core/domain';
import { ExternalRadio, SourceType } from '@sdj/ng/radio/core/domain';
import { UserUtils } from '@sdj/shared/utils';

@Pipe({
  name: 'awesomePlayerSecondTitle',
})
export class AwesomePlayerSecondTitlePipe implements PipeTransform {
  transform(type: SourceType, ...args: any[]): unknown {
    switch (type) {
      case SourceType.ExternalRadio:
        return '';
      case SourceType.Station:
        return (args[0] as QueuedTrack)?.addedBy ? `~${UserUtils.getUserName(args[0].addedBy)}` : 'Bot';
      default:
        return '';
    }
  }
}
