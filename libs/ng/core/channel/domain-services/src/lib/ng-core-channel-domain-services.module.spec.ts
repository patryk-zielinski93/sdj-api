import { async, TestBed } from '@angular/core/testing';
import { NgCoreChannelDomainServicesModule } from './ng-core-channel-domain-services.module';

describe('NgCoreChannelDomainServicesModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgCoreChannelDomainServicesModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(NgCoreChannelDomainServicesModule).toBeDefined();
  });
});
