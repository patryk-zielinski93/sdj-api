import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatSidenav } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ChannelService,
  SpeechService,
  WebSocketService
} from '@sdj/ng/shared/app/core';
import { Channel } from '@sdj/ng/shared/domain';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'sdj-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent implements OnInit, AfterViewInit {
  @ViewChild('sidenav', { static: true })
  sidenav: MatSidenav;

  channels$: Observable<Channel[]>;
  selectedChannel: Channel;

  private selectedChannelUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private channelService: ChannelService,
    private ws: WebSocketService,
    private route: ActivatedRoute,
    private router: Router,
    private speechService: SpeechService
  ) {}

  ngOnInit(): void {
    this.channels$ = this.channelService.getChannels();
    this.handleChannelChanges();
  }

  ngAfterViewInit(): void {
    this.handleSpeeching();
    this.handleSelectedChannelChange();
  }

  handleChannelChanges(): void {
    this.channelService.getSelectedChannel().subscribe((channel: Channel) => {
      this.selectedChannel = channel;
    });
  }

  handleSpeeching(): void {
    this.speechService.startListening();
  }

  handleSelectedChannelChange(): void {
    this.channelService.getSelectedChannel().subscribe((channel: Channel) => {
      this.selectedChannelUnsubscribe.next();
      this.selectedChannelUnsubscribe.complete();
      this.selectedChannelUnsubscribe = new Subject();
    });
  }

  onNavigateToRadio(): void {
    this.router.navigate([this.selectedChannel.id]);
  }

  onToggleMenu(): void {
    this.sidenav.toggle();
  }

  onSelectChannel(channel: Channel): void {
    this.channelService.selectChannel(channel);
  }

  onNavigateToMostPlayed(): void {
    this.router.navigate([this.selectedChannel.id, 'most-played']);
  }
}
