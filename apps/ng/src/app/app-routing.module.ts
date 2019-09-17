import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { ChannelResolver } from './modules/main/channel.resolver';
import { MainComponent } from './modules/main/main.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    resolve: {
      channel: ChannelResolver
    },
    children: [
      {
        component: MainComponent,
        path: ''
      },
      {
        component: MainComponent,
        path: ':channelId'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
