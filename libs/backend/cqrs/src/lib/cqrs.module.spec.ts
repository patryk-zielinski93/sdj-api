import { async, TestBed } from '@angular/core/testing';
import { SdjCqrsModule } from './cqrs.module';

describe('CqrsModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SdjCqrsModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SdjCqrsModule).toBeDefined();
  });
});
