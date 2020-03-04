import { async, TestBed } from '@angular/core/testing';
import { NgCoreAuthApplicationServicesModule } from './ng-core-auth-application-services.module';

describe('NgCoreAuthApplicationServicesModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgCoreAuthApplicationServicesModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(NgCoreAuthApplicationServicesModule).toBeDefined();
  });
});
