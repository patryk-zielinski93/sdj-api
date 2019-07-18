import { async, TestBed } from '@angular/core/testing';
import { SlackModule } from './slack.module';

describe('SlackModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SlackModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SlackModule).toBeDefined();
  });
});
