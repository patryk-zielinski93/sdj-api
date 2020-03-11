import { TestBed } from '@angular/core/testing';

import { TrackFacade } from './track.facade';

describe('TrackFacade', () => {
  let service: TrackFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrackFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
