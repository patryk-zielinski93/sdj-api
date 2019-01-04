import * as http from 'http';
import { connectionConfig } from '../configs/connection.config';

export class IcesService {
  static nextSong(): void {
    console.log('next song');
    http.get(`http://${connectionConfig.ices.host}:${connectionConfig.ices.port}`);
  }
}