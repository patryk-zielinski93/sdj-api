import { async, TestBed } from '@angular/core/testing';
import { NgCoreChannelShellModule } from './ng-core-channel-shell.module';

describe('NgCoreChannelShellModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgCoreChannelShellModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(NgCoreChannelShellModule).toBeDefined();
  });
});
