import { async, TestBed } from '@angular/core/testing';
import { NgCoreSharedInfrastructureApolloModule } from './ng-core-shared-infrastructure-apollo.module';

describe('NgCoreSharedInfrastructureApolloModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgCoreSharedInfrastructureApolloModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(NgCoreSharedInfrastructureApolloModule).toBeDefined();
  });
});
