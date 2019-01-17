import { Injectable } from '@nestjs/common';
import { from } from 'rxjs/internal/observable/from';
import { map, switchMap } from 'rxjs/operators';
import { User } from '../../../../../entities/user.model';
import { DbService } from '../../../../shared/services/db.service';
import { SocketIoo } from '../../../../../sio';
import { Gateway } from '../../../../web-socket/gateway';
import { Command } from '../interfaces/command.iterface';

@Injectable()
export class PozdroCommand implements Command {
  description = 'wyślij pozdro swoim ziomeczkom (może też być dla mamy)';
  type = 'pozdro';

  constructor(private websocket: Gateway) {
  }

  async handler(command: string[], message: any): Promise<any> {

    command.shift();
    const pozdro = command.join(' ');

    if (pozdro.length > 200) {
      throw new Error('too long');
    }

    DbService.getRepository(User).subscribe(async repository => {
      const user = await repository.findOne({ id: message.user });

      if (user) {
        console.log(user.realName + ' mowi: ' + pozdro);

        this.websocket.server.of('/').emit('pozdro', {
          message: /*'Pozdrowienia od ' + user.realName + ': ' +*/ pozdro
        })
      }
    });
  }
}
