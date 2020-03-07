import { async, TestBed } from '@angular/core/testing';
import { NgCoreChannelApplicationServicesModule } from './ng-core-channel-application-services.module';

describe('NgCoreChannelApplicationServicesModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgCoreChannelApplicationServicesModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(NgCoreChannelApplicationServicesModule).toBeDefined();
  });
});
