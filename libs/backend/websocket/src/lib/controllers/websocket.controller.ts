import { MessagePattern, EventPattern } from '@nestjs/microservices';
import { Gateway } from '../gateway';
import { Controller } from '@nestjs/common';

@Controller()
export class WebSocketController {
  tmp: number = Math.floor(Math.random() * 10) || 0; 
  constructor(private readonly gateway: Gateway) {}

 
  @EventPattern('pozdro')
  @MessagePattern('pozdro')
  pozdro(data: string): void {
    console.log(data + this.tmp);
    this.gateway.server.of('/').emit('pozdro', {
      message: data
    });
  }
} 
 