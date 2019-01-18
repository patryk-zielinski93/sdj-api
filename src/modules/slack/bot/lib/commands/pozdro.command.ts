import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../../shared/modules/db/repositories/user.repository';
import { DbService } from '../../../../shared/services/db.service';
import { Gateway } from '../../../../web-socket/gateway';
import { Command } from '../interfaces/command.iterface';

@Injectable()
export class PozdroCommand implements Command {
  description = 'wyślij pozdro swoim ziomeczkom (może też być dla mamy)';
  type = 'pozdro';

  constructor(private userRepository: UserRepository, private websocket: Gateway) {
  }

  async handler(command: string[], message: any): Promise<any> {

    command.shift();
    const pozdro = command.join(' ');

    if (pozdro.length > 200) {
      throw new Error('too long');
    }

    const user = await this.userRepository.findOne({ id: message.user });

      if (user) {
        console.log(user.realName + ' mowi: ' + pozdro);

        this.websocket.server.of('/').emit('pozdro', {
          message: /*'Pozdrowienia od ' + user.realName + ': ' +*/ pozdro
        })
      }
  }
}
