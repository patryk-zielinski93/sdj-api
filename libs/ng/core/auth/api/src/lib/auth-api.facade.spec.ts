import { TestBed } from '@angular/core/testing';
import { AuthFacade } from '@sdj/ng/core/auth/application-services';
import { createSpyObj } from 'jest-createspyobj';

import { AuthApiFacade } from './auth-api.facade';

describe('AuthApiFacade', () => {
  let service: AuthApiFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthApiFacade,
        { provide: AuthFacade, useValue: createSpyObj(AuthFacade) }
      ]
    });
    service = TestBed.inject(AuthApiFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
