import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ChannelFacade } from '@sdj/ng/core/channel/application-services';
import {
  QueuedTrackFacade,
  RadioFacade
} from '@sdj/ng/core/radio/application-services';
import { AwesomePlayerComponent } from '@sdj/ng/presentation/shared/presentation-players';
import { LoaderComponent } from '@sdj/ng/presentation/shared/presentation-sdj-loader';
import { createSpyObj } from 'jest-createspyobj';
import { hot } from 'jest-marbles';
import { MockComponent } from 'ng-mocks';

import { RadioComponent } from './radio.component';

describe('RadioComponent', () => {
  let component: RadioComponent;
  let fixture: ComponentFixture<RadioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [
        RadioComponent,
        MockComponent(AwesomePlayerComponent),
        MockComponent(LoaderComponent)
      ],
      providers: [
        { provide: ChannelFacade, useValue: createSpyObj(ChannelFacade) },
        {
          provide: QueuedTrackFacade,
          useValue: createSpyObj(QueuedTrackFacade)
        },
        { provide: RadioFacade, useValue: createSpyObj(RadioFacade) }
      ]
    }).compileComponents();

    const radioFacade = TestBed.inject(RadioFacade);
    radioFacade.speeching$ = hot('');

    const channelFacade = TestBed.inject<ChannelFacade>(ChannelFacade);
    (channelFacade.selectedChannel$ as any) = hot('');
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
