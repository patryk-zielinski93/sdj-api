import { async, TestBed } from '@angular/core/testing';
import { NgCoreRadioInfrastructureModule } from './ng-core-radio-infrastructure.module';

describe('NgCoreRadioInfrastructureModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgCoreRadioInfrastructureModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(NgCoreRadioInfrastructureModule).toBeDefined();
  });
});
