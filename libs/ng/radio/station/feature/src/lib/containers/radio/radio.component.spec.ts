import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ExternalRadioFacade,
  QueuedTrackFacade,
  RadioFacade,
} from '@sdj/ng/radio/core/application-services';
import { ChannelFacade } from '@sdj/ng/radio/core/domain';
import {
  AwesomePlayerSecondTitlePipe,
  AwesomePlayerTitlePipe,
  RadioActionMenuComponent,
} from '@sdj/ng/radio/station/presentation';
import { WebSocketClient } from '@sdj/ng/shared/core/application-services';
import { AwesomePlayerComponent } from '@sdj/ng/shared/presentation-players';
import { LoaderComponent } from '@sdj/ng/shared/presentation-sdj-loader';
import { createSpyObj } from 'jest-createspyobj';
import { hot } from 'jest-marbles';
import { MockComponents, MockPipes } from 'ng-mocks';
import { RadioComponent } from './radio.component';
import Mocked = jest.Mocked;

describe('RadioComponent', () => {
  let component: RadioComponent;
  let fixture: ComponentFixture<RadioComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule, HttpClientTestingModule],
        declarations: [
          RadioComponent,
          MockComponents(
            AwesomePlayerComponent,
            LoaderComponent,
            RadioActionMenuComponent
          ),
          MockPipes(AwesomePlayerSecondTitlePipe, AwesomePlayerTitlePipe),
        ],
        providers: [
          { provide: ChannelFacade, useValue: createSpyObj(ChannelFacade) },
          {
            provide: QueuedTrackFacade,
            useValue: createSpyObj(QueuedTrackFacade),
          },
          { provide: RadioFacade, useValue: createSpyObj(RadioFacade) },
          { provide: WebSocketClient, useValue: createSpyObj(WebSocketClient) },
          { provide: MatDialog, useValue: createSpyObj(MatDialog) },
          {
            provide: ExternalRadioFacade,
            useValue: createSpyObj(ExternalRadioFacade),
          },
        ],
      }).compileComponents();

      const radioFacade = TestBed.inject(RadioFacade);
      radioFacade.speeching$ = hot('');

      const channelFacade = TestBed.inject<ChannelFacade>(ChannelFacade);
      (channelFacade.selectedChannel$ as any) = hot('');

      const webSocketClient: Mocked<WebSocketClient> = TestBed.inject<any>(
        WebSocketClient
      );
      webSocketClient.observe = jest.fn();
      webSocketClient.observe.mockReturnValue(hot(''));
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
