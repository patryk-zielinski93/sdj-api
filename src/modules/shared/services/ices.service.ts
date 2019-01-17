import { Injectable } from '@nestjs/common';
import * as http from 'http';
import { connectionConfig } from '../../../configs/connection.config';

@Injectable()
export class IcesService {
  static nextSong(): void {
    console.log('next song');
    http.get(`http://${connectionConfig.ices.host}:${connectionConfig.ices.port}`);
  }
}