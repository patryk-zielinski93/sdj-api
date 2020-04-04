import { async, TestBed } from '@angular/core/testing';
import { NgCoreTrackShellModule } from './ng-core-track-shell.module';

describe('NgCoreTrackShellModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgCoreTrackShellModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(NgCoreTrackShellModule).toBeDefined();
  });
});
