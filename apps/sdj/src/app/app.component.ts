import { AfterViewInit, Component, ViewChild, ElementRef } from '@angular/core';
import { environment } from '@environment/environment';
import { Observable, Subject, zip } from 'rxjs';
import { filter, map, tap, delay, skipUntil } from 'rxjs/operators';
import { appConfig } from '../configs/app.config';
import { QueuedTrack } from './common/interfaces/queued-track.interface';
import { SpeechService } from './modules/core/services/speech.service';
import { WebSocketService } from './modules/core/services/web-socket.service';
import { AwesomePlayerComponent } from './modules/main/components/awesome-player/awesome-player.component';
import { TrackUtil } from './modules/core/utils/track.util';

@Component({
  selector: 'sdj-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {}
