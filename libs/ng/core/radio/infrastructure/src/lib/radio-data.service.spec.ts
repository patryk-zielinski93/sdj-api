import { TestBed } from '@angular/core/testing';

import { RadioDataService } from './radio-data.service';

describe('RadioDataService', () => {
  let service: RadioDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RadioDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
