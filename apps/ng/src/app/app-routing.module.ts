import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { ChannelResolver } from './modules/main/channel.resolver';
import { MostPlayedTracksResolver } from './modules/main/components/views/most-played-view/most-played-tracks.resolver';
import { MostPlayedViewComponent } from './modules/main/components/views/most-played-view/most-played-view.component';
import { RadioViewComponent } from './modules/main/components/views/radio-view/radio-view.component';
import { MainComponent } from './modules/main/main.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    resolve: {
      channel: ChannelResolver,
    },
    children: [
      {
        component: MainComponent,
        path: ''
      },
      {
        component: MainComponent,
        path: ':channelId',
        children: [
          {
            component: RadioViewComponent,
            path: ''
          },
          {
            component: MostPlayedViewComponent,
            path: 'most-played',
            resolve: {
              tracks: MostPlayedTracksResolver
            }
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
