import { async, TestBed } from '@angular/core/testing';
import { NgCoreChannelInfrastructureModule } from './ng-core-channel-infrastructure.module';

describe('NgCoreChannelInfrastructureModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgCoreChannelInfrastructureModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(NgCoreChannelInfrastructureModule).toBeDefined();
  });
});
