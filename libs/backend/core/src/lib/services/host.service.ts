import { Injectable } from '@nestjs/common';
import * as http from 'http';
import Axios from 'axios';

@Injectable()
export class HostService {
  static removeRadioStream(id: string): void {
    Axios.delete(`http://${process.env.HOST_IP}:8887/remove/${id}`);
  }

  static startRadioStream(id: string): void {
    Axios.post(`http://${process.env.HOST_IP}:8887/start/${id}`);
  }

  static nextSong(channelId: string): void {
    Axios.put(`http://${process.env.HOST_IP}:8887/next/${channelId}`);
  }
}
