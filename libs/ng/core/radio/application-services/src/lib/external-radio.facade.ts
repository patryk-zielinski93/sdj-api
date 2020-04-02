import { Injectable } from '@angular/core';
import {
  ExternalRadioEntity,
  ExternalRadioGroup
} from '@sdj/ng/core/radio/domain';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ExternalRadioFacade {
  externalRadioGroups$ = new BehaviorSubject(externalRadios);
  selectedExternalRadio$ = new BehaviorSubject(null);

  select(radio: ExternalRadioEntity): void {
    this.selectedExternalRadio$.next(radio);
  }
}

const externalRadios: ExternalRadioGroup[] = [
  {
    title: 'Various',
    radios: [
      {
        title: 'Radio Zet',
        iconUrl:
          'https://upload.wikimedia.org/wikipedia/commons/4/4b/Radio_ZET_logo.png',
        url: 'https://n-4-14.dcs.redcdn.pl/sc/o2/Eurozet/live/audio.livx'
      },
      {
        title: 'RMF FM',
        url: 'http://rmfstream2.interia.pl:8000/rmf_fm',
        iconUrl:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/RMF_FM_logo.svg/1200px-RMF_FM_logo.svg.png'
      }
    ]
  },
  {
    title: 'Open FM',
    radios: [
      {
        title: 'Open FM - Work',
        url: 'https://stream.open.fm/109',
        iconUrl: 'https://open.fm/logo/200x200/109'
      }
    ]
  }
];
