import { async, TestBed } from '@angular/core/testing';
import { NgCoreRadioShellModule } from './ng-core-radio-shell.module';

describe('NgCoreRadioShellModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgCoreRadioShellModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(NgCoreRadioShellModule).toBeDefined();
  });
});
