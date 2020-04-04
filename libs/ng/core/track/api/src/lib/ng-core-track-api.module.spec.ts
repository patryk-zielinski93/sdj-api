import { async, TestBed } from '@angular/core/testing';
import { NgCoreTrackApiModule } from './ng-core-track-api.module';

describe('NgCoreTrackApiModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgCoreTrackApiModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(NgCoreTrackApiModule).toBeDefined();
  });
});
