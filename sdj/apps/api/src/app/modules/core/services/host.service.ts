import { Injectable } from '@nestjs/common';
import * as http from 'http';

@Injectable()
export class HostService {
  static removeRadioStream(id: string): void {
    http.get(`http://${process.env.HOST_IP}:8887/remove/${id}`);
  }

  static startRadioStream(id: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      http.get(`http://${process.env.HOST_IP}:8887/start/${id}`, resolve);
    });
  }

  static nextSong(channelId: string): void {
    console.log('next song');
    http.get(`http://${process.env.HOST_IP}:8887/next/${channelId}`);
  }
}
