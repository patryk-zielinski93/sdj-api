import { async, TestBed } from '@angular/core/testing';
import { RedisModule } from './redis.module';

describe('RedisModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RedisModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(RedisModule).toBeDefined();
  });
});
