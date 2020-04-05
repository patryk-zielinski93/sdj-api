import { async, TestBed } from '@angular/core/testing';
import { NgCoreQueuedTrackInfrastructureModule } from './ng-core-queued-track-infrastructure.module';

describe('NgCoreQueuedTrackInfrastructureModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgCoreQueuedTrackInfrastructureModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(NgCoreQueuedTrackInfrastructureModule).toBeDefined();
  });
});
