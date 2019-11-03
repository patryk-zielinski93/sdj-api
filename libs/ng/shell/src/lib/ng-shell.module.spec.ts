import { async, TestBed } from "@angular/core/testing";
import { NgShellModule } from "./ng-shell.module";

describe('NgShellModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgShellModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(NgShellModule).toBeDefined();
  });
});
