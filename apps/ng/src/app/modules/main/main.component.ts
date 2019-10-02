import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebSocketEvents } from '@sdj/shared/common';
import { Observable, Subject } from 'rxjs';
import { Channel } from '../core/resources/interfaces/channel.interface';
import { ChannelService } from '../core/services/channel.service';
import { SpeechService } from '../core/services/speech.service';
import { WebSocketService } from '../core/services/web-socket.service';

@Component({
  selector: 'sdj-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit {

  channels$: Observable<Channel[]>;
  selectedChannel: Channel;

  private selectedChannelUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private channelService: ChannelService,
    private ws: WebSocketService,
    private route: ActivatedRoute,
    private speechService: SpeechService
  ) {
  }

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
    const join$ = this.ws.createSubject(WebSocketEvents.join);
    this.channelService.getSelectedChannel().subscribe((channel: Channel) => {
      this.selectedChannelUnsubscribe.next();
      this.selectedChannelUnsubscribe.complete();
      this.selectedChannelUnsubscribe = new Subject();
      join$.next({ room: channel.id });
    });
  }

  selectChannel(channel: Channel): void {
    this.channelService.selectChannel(channel);
  }
}
