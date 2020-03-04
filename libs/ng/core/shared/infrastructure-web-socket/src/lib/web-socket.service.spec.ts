import { TestBed } from '@angular/core/testing';

import { WebSocketClientAdapter } from './web-socket-client-adapter';

describe('WebSocketService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WebSocketClientAdapter = TestBed.inject(
      WebSocketClientAdapter
    );
    expect(service).toBeTruthy();
  });
});
