import { async, TestBed } from '@angular/core/testing';
import { IcesModule } from './ices.module';

describe('IcesModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [IcesModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(IcesModule).toBeDefined();
  });
});
