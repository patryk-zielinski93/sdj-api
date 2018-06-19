import { from } from 'rxjs/internal/observable/from';
import { map, switchMap } from 'rxjs/operators';
import { User } from '../../../entities/user.model';
import { DbService } from '../../../services/db.service';
import { SocketIoo } from '../../../sio';
import { Command } from '../interfaces/command.iterface';

export class PozdroCommand implements Command {
  description = '- wyślij pozdro swoim ziomeczkom (może też być dla mamy)';
  type = 'pozdro';

  async handler(command: string[], message: any): Promise<any> {
    const sio = SocketIoo.sio;

    if (!sio) {
      return;
    }

    command.shift();
    const pozdro = command.join(' ');

    if (pozdro.length > 200) {
      throw new Error('too long');
    }

    DbService.getRepository(User).subscribe(async repository => {
      const user = await repository.findOne({ id: message.user });

      if (user) {
        console.log(user.realName + ' mowi: ' + pozdro);

        sio.of('/').emit('pozdro', {
          message: /*'Pozdrowienia od ' + user.realName + ': ' +*/ pozdro
        })
      }
    });
  }
}
