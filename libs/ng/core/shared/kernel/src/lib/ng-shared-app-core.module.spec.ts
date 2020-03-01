import { async, TestBed } from '@angular/core/testing';
import { NgSharedAppCoreModule } from './ng-shared-app-core.module';

describe('NgSharedAppCoreModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgSharedAppCoreModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(NgSharedAppCoreModule).toBeDefined();
  });
});
