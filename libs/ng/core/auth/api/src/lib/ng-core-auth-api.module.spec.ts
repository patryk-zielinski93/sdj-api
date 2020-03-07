import { async, TestBed } from '@angular/core/testing';
import { NgCoreAuthApiModule } from './ng-core-auth-api.module';

describe('NgCoreAuthApiModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgCoreAuthApiModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(NgCoreAuthApiModule).toBeDefined();
  });
});
