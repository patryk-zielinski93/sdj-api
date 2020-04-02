import { async, TestBed } from '@angular/core/testing';
import { NgCoreChannelApiModule } from './ng-core-channel-api.module';

describe('NgCoreChannelApiModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgCoreChannelApiModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(NgCoreChannelApiModule).toBeDefined();
  });
});
