import { TestBed } from '@angular/core/testing';
import { TrackRepository } from '@sdj/ng/core/radio/domain-services';

import { TrackFacade } from './track.facade';
import { createSpyObj } from 'jest-createspyobj';

describe('TrackFacade', () => {
  let service: TrackFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TrackFacade,
        { provide: TrackRepository, useValue: createSpyObj(TrackRepository) }
      ]
    });
    service = TestBed.inject(TrackFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
