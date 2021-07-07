import { TestBed, waitForAsync } from '@angular/core/testing';
import { NgRadioCoreApplicationServicesModule } from './ng-radio-core-application-services.module';

describe('NgRadioCoreApplicationServicesModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [NgRadioCoreApplicationServicesModule],
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(NgRadioCoreApplicationServicesModule).toBeDefined();
  });
});
