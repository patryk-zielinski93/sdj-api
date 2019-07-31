import { SpawnOptions, spawn } from 'child_process';
import { Observable, Subject } from 'rxjs';

export namespace Utils {
  export interface SpawnResult {
    signal$: Observable<number>;
    execSpawn: () => Observable<number>;
  }
  export function spawnRx(
    command: string,
    args?: string[],
    options?: SpawnOptions
  ): SpawnResult {
    const signal$ = new Subject<number>();
    const execSpawn = () => {
      const signal = spawn(command, args, options);

      signal.on('close', code => {
        signal$.next(code);
        signal$.complete();
      });
      return signal$;
    };
    return { execSpawn, signal$ };
  }
}
