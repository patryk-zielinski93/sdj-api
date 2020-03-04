import { async, TestBed } from '@angular/core/testing';
import { NgCoreSharedKernelModule } from './ng-core-shared-kernel.module';

describe('NgSharedAppCoreModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgCoreSharedKernelModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(NgCoreSharedKernelModule).toBeDefined();
  });
});
