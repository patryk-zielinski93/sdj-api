import { async, TestBed } from '@angular/core/testing';
import { NgCoreAuthInfrastructureModule } from './ng-core-auth-infrastructure.module';

describe('NgCoreAuthInfrastructureModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgCoreAuthInfrastructureModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(NgCoreAuthInfrastructureModule).toBeDefined();
  });
});
