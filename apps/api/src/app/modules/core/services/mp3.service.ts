import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import * as path from 'path';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';
import { finalize, switchMap } from 'rxjs/operators';
import * as ytdl from 'youtube-dl';
import { connectionConfig } from '../../../configs/connection.config';
import { pathConfig } from '../../../configs/path.config';

@Injectable()
export class Mp3Service {
  private inProgress: { [key: string]: Observable<string> } = {};

  constructor() {}

  /**
   * Download youtube video, convert and normalize mp3.
   * @param {string} id - youtube video id
   * @returns {Observable<string>} - mp3 duration after normalization
   */
  downloadAndNormalize(id: string): Observable<string> {
    if (this.inProgress[id]) {
      return this.inProgress[id];
    }

    const obs = this.download(id).pipe(
      switchMap(filePath =>
        this.normalize(filePath).pipe(
          switchMap(() => this.getDuration(filePath))
        )
      ),
      finalize(() => {
        delete this.inProgress[id];
      })
    );

    this.inProgress[id] = obs;

    return obs;
  }

  /**
   * Download youtube video and covert it to mp3 format.
   * @param {string} id - youtube video id
   * @returns {Observable<string>} - created mp3 system path
   */
  private download(id: string): Observable<string> {
    const sub = new Subject<string>();
    let filePath = path.join(pathConfig.tracks, id);

    ytdl.exec(
      `https://www.youtube.com/watch?v=${id}`,
      [
        '--restrict-filenames',
        '--geo-bypass-country',
        'PL',
        '-o',
        filePath + '.%(ext)s',
        '--extract-audio',
        '--audio-format',
        'mp3',
        '--audio-quality',
        '1'
      ],
      {},
      (err, output) => {
        if (err) {
          sub.error(err);
          sub.complete();
          return;
        }

        sub.next(filePath + '.mp3');
        sub.complete();
      }
    );

    return sub;
  }

  /**
   * Get mp3 duration.
   * @param {string} filePath - system path to mp3 file
   * @returns {Observable<string>}
   */
  private getDuration(filePath: string): Observable<string> {
    const sub = new Subject<string>();

    try {
      exec(`mp3info -p "%S" ${filePath}`, (err, stdout, stderr) => {
        if (err) {
          sub.error(err);
        } else {
          sub.next(stdout);
        }

        sub.complete();
      });
    } catch (e) {
      sub.error(e);
      sub.complete();
    }

    return sub;
  }

  /**
   * Normalize mp3 with mp3gain.
   * @param {string} filePath - system path to mp3 file
   * @returns {Observable<void>}
   */
  private normalize(filePath: string): Observable<void> {
    const sub = new Subject<void>();

    exec(
      `mp3gain -c -p -r -d ${connectionConfig.tracks.normalizationDb -
        89} ${filePath} && \\
sox ${filePath} ${filePath}.temp.mp3 silence 1 0.1 1% reverse silence 1 0.1 1% reverse && \\
rm ${filePath} && \\
mv ${filePath}.temp.mp3 ${filePath}
`,
      (err, stdout, stderr) => {
        if (err) {
          sub.error(err);
        } else {
          sub.next();
        }

        sub.complete();
      }
    );

    return sub;
  }
}
