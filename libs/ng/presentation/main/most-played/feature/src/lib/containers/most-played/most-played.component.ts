import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { ChannelService } from '@sdj/ng/core/shared/kernel';
import { Channel, dynamicEnv, Track } from '@sdj/ng/core/radio/domain';
import { Apollo } from 'apollo-angular';
import { ApolloQueryResult } from 'apollo-client';
import gql from 'graphql-tag';
import { Track as MatTrack } from 'ngx-audio-player';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'sdj-most-played',
  templateUrl: './most-played.component.html',
  styleUrls: ['./most-played.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MostPlayedComponent implements OnInit, OnDestroy {
  channel: Channel;
  loading: boolean = true;
  tracks: MatTrack[] = [];

  constructor(
    private chD: ChangeDetectorRef,
    private channelService: ChannelService,
    private apollo: Apollo
  ) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.handleSelectedChannelChange();
  }

  handleSelectedChannelChange(): void {
    this.channelService
      .getSelectedChannel()
      .pipe(untilDestroyed(this))
      .subscribe((channel: Channel) => {
        this.channel = channel;
        this.loadMostPlayedTracks(channel);
      });
  }

  loadMostPlayedTracks(channel: Channel): void {
    this.apollo
      .watchQuery({
        query: gql`
          {
              mostPlayedTracks(channelId: "${channel.id}") {
                  title,
                  id,
                  playedCount
              }
          }
      `
      })
      .valueChanges.subscribe(
        (result: ApolloQueryResult<{ mostPlayedTracks: Track[] }>) => {
          const { data, loading, errors } = result;
          this.tracks = data.mostPlayedTracks.map((track: Track) => {
            return {
              title: `${track.title}. Played ${track.playedCount} times`,
              link: dynamicEnv.backendUrl + 'tracks/' + track.id + '.mp3'
            };
          });
          this.loading = loading;
          this.chD.markForCheck();
        }
      );
  }
}
