import { async, TestBed } from '@angular/core/testing';
import { NgPresentationMainRadioPresentationModule } from './ng-presentation-main-radio-presentation.module';

describe('NgPresentationMainRadioPresentationModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgPresentationMainRadioPresentationModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(NgPresentationMainRadioPresentationModule).toBeDefined();
  });
});
