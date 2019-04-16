import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Channel } from '../../resources/entities/channel.entity';
import { ChannelService } from '../core/services/channel.service';

@Injectable({ providedIn: 'root' })
export class ChannelResolver implements Resolve<Channel[]> {
    constructor(private channelService: ChannelService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Channel[]> | Promise<Channel[]> | Channel[] {
        this.channelService.loadChannels();
        return this.channelService.getChannels();
    }

}
