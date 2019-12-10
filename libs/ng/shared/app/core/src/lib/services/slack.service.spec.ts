import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { SlackService } from './slack.service';

describe('SlackService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] })
  );

  it('should be created', () => {
    const service: SlackService = TestBed.get(SlackService);
    expect(service).toBeTruthy();
  });
});
