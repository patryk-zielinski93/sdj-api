import { TestBed } from '@angular/core/testing';
import { TrackRepository } from '@sdj/ng/core/radio/domain-services';
import { createSpyObj } from 'jest-createspyobj';

import { TrackFacade } from './track.facade';

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
