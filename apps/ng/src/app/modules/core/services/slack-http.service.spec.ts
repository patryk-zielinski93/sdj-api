import { TestBed } from '@angular/core/testing';

import { SlackHttpService } from './slack-http.service';

describe('SlackHttpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SlackHttpService = TestBed.get(SlackHttpService);
    expect(service).toBeTruthy();
  });
});
