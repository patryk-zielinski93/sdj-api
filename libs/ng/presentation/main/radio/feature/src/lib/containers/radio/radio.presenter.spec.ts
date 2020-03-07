import { TestBed } from '@angular/core/testing';
import { RadioFacade } from '@sdj/ng/core/radio/application-services';
import { createSpyObj } from 'jest-createspyobj';

import { RadioPresenter } from './radio.presenter';

describe('RadioPresenterService', () => {
  let service: RadioPresenter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RadioPresenter,
        { provide: RadioFacade, useValue: createSpyObj(RadioFacade) }
      ]
    });
    service = TestBed.inject(RadioPresenter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
