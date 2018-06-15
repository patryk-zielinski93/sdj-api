import { Observable, Subject } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { map, tap } from 'rxjs/operators';
import { Connection, createConnection, EntitySchema } from 'typeorm';
import { ObjectType } from 'typeorm/common/ObjectType';
import { Repository } from 'typeorm/repository/Repository';

export class DbService {
  private static connecting = false;
  private static connection: Connection;

  static getConnection(): Observable<Connection> {
    return this.createConnection();
  }

  static getConnectionPromise(): Promise<Connection> {
    return new Promise<Connection>((resolve, reject) => {
      this.createConnection().subscribe(conn => {
        resolve(conn);
      }, err => {
        reject(err);
      });
    });
  }

  static getRepository<Entity>(target: ObjectType<Entity> | EntitySchema<Entity> | string): Observable<Repository<Entity>> {
    return this.getConnection().pipe(
      map(connection => connection.getRepository(target))
    );
  }

  static async getRepositoryPromise<Entity>(target: ObjectType<Entity> | EntitySchema<Entity> | string): Promise<Repository<Entity>> {
    const connection = await DbService.getConnectionPromise();
    return connection.getRepository(target);
  }

  /**
   * Create DB connection or return existing connection.
   * @returns {Observable<Connection>}
   */
  private static createConnection(): Observable<Connection> {
    if (this.connection) {
      const sub = new Subject<Connection>();

      setTimeout(() => {
        sub.next(this.connection);
        sub.complete();
      });

      return sub;
    }

    this.connecting = true;

    return fromPromise(createConnection()).pipe(
      tap(conn => {
        this.connecting = false;
        this.connection = conn;
      })
    );
  }
}
