import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ChannelService } from './channel.service';

describe('ChannelService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: ChannelService = TestBed.inject(ChannelService);
    expect(service).toBeTruthy();
  });
});
