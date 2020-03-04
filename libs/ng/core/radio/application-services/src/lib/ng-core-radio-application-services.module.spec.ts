import { async, TestBed } from '@angular/core/testing';
import { NgCoreRadioApplicationServicesModule } from './ng-core-radio-application-services.module';

describe('NgCoreRadioApplicationServicesModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgCoreRadioApplicationServicesModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(NgCoreRadioApplicationServicesModule).toBeDefined();
  });
});
