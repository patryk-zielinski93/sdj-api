import { Injectable } from '@nestjs/common';
import Axios from 'axios';

@Injectable()
export class HostService {
  static removeRadioStream(id: string): void {
    Axios.delete(`http://${process.env.HOST_IP}:8887/remove/${id}`).catch((err) => console.error(err));
  }

  static startRadioStream(id: string): void {
    Axios.post(`http://${process.env.HOST_IP}:8887/start/${id}`).catch((err) => console.error(err));
  }

  static nextSong(channelId: string): void {
    Axios.put(`http://${process.env.HOST_IP}:8887/next/${channelId}`).catch((err) => console.error(err));
  }
}
