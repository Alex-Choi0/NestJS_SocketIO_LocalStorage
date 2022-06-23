import { Injectable } from '@nestjs/common';
import { CreateSocketioDto } from './dto/create-socketio.dto';
import { Socketio } from './entities/socketio.entity';

@Injectable()
export class SocketioService {
  messages: Socketio[] = [
    { name: 'NestJS-SocketIO', text: 'Starting SocketIO Communication' },
  ];

  client = {};

  create(createSocketioDto: CreateSocketioDto, id: string) {
    const message = {
      name: this.client[id],
      text: createSocketioDto.text,
    };
    console.log('service create : ', message);
    this.messages.push(message);
    return message;
  }

  findAll() {
    console.log(
      'Request message Data(SocketioService : findAll) : ',
      this.messages,
    );
    return this.messages;
  }

  joinRoom(user: string, id: string) {
    this.client[id] = user;
    console.log('Current Room user :', this.client);
    return Object.values(this.client);
  }
}
