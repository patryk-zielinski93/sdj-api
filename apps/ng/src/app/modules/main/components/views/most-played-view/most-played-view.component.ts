import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from '@ng-environment/environment.prod';
import { Channel, Track } from '@sdj/shared/common';
import { Apollo } from 'apollo-angular';
import { ApolloQueryResult } from 'apollo-client';
import gql from 'graphql-tag';
import { Track as MatTrack } from 'ngx-audio-player';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ChannelService } from '../../../../core/services/channel.service';
import { WebSocketService } from '../../../../core/services/web-socket.service';

@Component({
  selector: 'most-played-view',
  templateUrl: './most-played-view.component.html',
  styleUrls: ['./most-played-view.component.scss']
})
export class MostPlayedViewComponent implements OnInit, OnDestroy {

  channel: Channel;
  tracks: MatTrack[] = [];

  constructor(private channelService: ChannelService, private apollo: Apollo, private ws: WebSocketService) {
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.handleSelectedChannelChange();
  }

  handleSelectedChannelChange(): void {
    this.channelService.getSelectedChannel()
      .pipe(untilDestroyed(this))
      .subscribe((channel: Channel) => {
        this.channel = channel;
        this.loadMostPlayedTracks(channel);
      });
  }

  loadMostPlayedTracks(channel: Channel): void {
    this.apollo.watchQuery({
      query: gql`
          {
              mostPlayedTracks(channelId: "${channel.id}") {
                  title,
                  id
              }
          }
      `
    }).valueChanges.subscribe((result: ApolloQueryResult<{ mostPlayedTracks: Track[] }>) => {
      const { data, loading, errors } = result;
      this.tracks = data.mostPlayedTracks.map((track: Track) => {
        return { title: track.title, link: environment.backendUrl + 'tracks/' + track.id + '.mp3' };
      });
    });
  }
}
