import { async, TestBed } from '@angular/core/testing';
import { NgPresentationMainShellModule } from './ng-presentation-main-shell.module';

describe('NgPresentationMainShellModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgPresentationMainShellModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(NgPresentationMainShellModule).toBeDefined();
  });
});
