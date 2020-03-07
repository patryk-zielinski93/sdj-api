import { TestBed } from '@angular/core/testing';

import { RadioPresenter } from './radio.presenter';

describe('RadioPresenterService', () => {
  let service: RadioPresenter;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RadioPresenter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
