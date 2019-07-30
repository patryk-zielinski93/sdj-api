import { Observable, Subject } from 'rxjs';
import { spawn } from 'child_process';
import { concatMap } from 'rxjs/operators';
export class IcesManager {
  commands$: Subject<() => Subject<number>> = new Subject<
    () => Subject<number>
  >();

  constructor() {
    this.handleCommands();
  }

  handleCommands(): void {
    this.commands$
      .pipe(concatMap((callback: () => Observable<number>) => callback()))
      .subscribe();
  }

  nextSong(id: string): Observable<number> {
    const signal$ = new Subject<number>();
    this.commands$.next(() => {
      const signal = spawn('bash', [
        '-c',
        `docker exec slack_dj_ices_${id} bash -c "pgrep -f ices | xargs kill -s SIGUSR1"`
      ]);

      signal.on('close', code => {
        console.log(`next exited with code ${code}`);
        signal$.next(code);
        signal$.complete();
      });
      return signal$;
    });
    return signal$;
  }
  startContainer(id: string): Observable<number> {
    const signal$ = new Subject<number>();
    this.commands$.next(() => {
      const signal = spawn('bash', [
        '-c',
        `docker-compose run -d  --name slack_dj_ices_${id} -e ROOM_ID=${id} slack_dj_ices`
      ]);

      signal.stdout.on('data', (data: string) => {
        console.log(`stdout: ${data}`);
      });

      signal.on('close', code => {
        console.log(`starting exited with code ${code}`);
        signal$.next(code);
        signal$.complete();
      });
      return signal$;
    });

    return signal$;
  }

  removeContainer(id: string): Observable<number> {
    const signal$ = new Subject<number>();
    this.commands$.next(() => {
      const signal = spawn('bash', ['-c', `docker rm -f slack_dj_ices_${id}`]);

      signal.stdout.on('data', (data: string) => {
        console.log(`stdout: ${data}`);
      });

      signal.on('close', code => {
        console.log(`starting exited with code ${code}`);
        signal$.next(code);
        signal$.complete();
      });
      return signal$;
    });
    return signal$;
  }
}

export default new IcesManager();
