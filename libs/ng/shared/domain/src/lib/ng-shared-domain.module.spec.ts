import { async, TestBed } from '@angular/core/testing';
import { NgSharedDomainModule } from './ng-shared-domain.module';

describe('NgSharedDomainModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgSharedDomainModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(NgSharedDomainModule).toBeDefined();
  });
});
