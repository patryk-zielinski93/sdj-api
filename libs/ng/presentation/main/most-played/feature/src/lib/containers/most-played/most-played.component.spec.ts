import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ChannelFacade } from '@sdj/ng/core/radio/application-services';
import { LoaderComponent } from '@sdj/ng/presentation/shared/presentation-sdj-loader';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { createSpyObj } from 'jest-createspyobj';
import { hot } from 'jest-marbles';
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
      ],
      providers: [
        { provide: ChannelFacade, useValue: createSpyObj(ChannelFacade) }
      ]
    }).compileComponents();

    const channelFacade = TestBed.inject(ChannelFacade);
    (channelFacade.selectedChannel$ as any) = hot('');
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
