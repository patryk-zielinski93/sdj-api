import { async, TestBed } from '@angular/core/testing';
import { NgCoreSharedInfrastructureSlackModule } from './ng-core-shared-infrastructure-slack.module';

describe('NgCoreSharedInfrastructureSlackModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgCoreSharedInfrastructureSlackModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(NgCoreSharedInfrastructureSlackModule).toBeDefined();
  });
});
