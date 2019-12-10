import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoaderComponent } from '@sdj/ng/shared/ui/sdj-loader';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { MockComponent } from 'ng-mocks';
import { MatAdvancedAudioPlayerComponent } from 'ngx-audio-player';
import { MostPlayedComponent } from './most-played.component';

describe('MostPlayedComponent', () => {
  let component: MostPlayedComponent;
  let fixture: ComponentFixture<MostPlayedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        ApolloTestingModule
      ],
      declarations: [
        MostPlayedComponent,
        MockComponent(LoaderComponent),
        MockComponent(MatAdvancedAudioPlayerComponent)
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MostPlayedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
