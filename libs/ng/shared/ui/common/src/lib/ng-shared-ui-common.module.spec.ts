import { async, TestBed } from "@angular/core/testing";
import { NgSharedUiCommonModule } from "./ng-shared-ui-common.module";

describe('NgSharedUiCommonModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgSharedUiCommonModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(NgSharedUiCommonModule).toBeDefined();
  });
});
