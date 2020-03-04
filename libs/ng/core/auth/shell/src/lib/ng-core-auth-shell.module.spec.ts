import { async, TestBed } from '@angular/core/testing';
import { NgCoreAuthShellModule } from './ng-core-auth-shell.module';

describe('NgCoreAuthShellModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgCoreAuthShellModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(NgCoreAuthShellModule).toBeDefined();
  });
});
