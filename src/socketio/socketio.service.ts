import { Injectable } from '@nestjs/common';
import { CreateSocketioDto } from './dto/create-socketio.dto';

@Injectable()
export class SocketioService {
  // messages: Socketio[] = [
  //   { name: 'NestJS-SocketIO', text: 'Starting SocketIO Communication' },
  // ];

  roomUser = {};

  roomMessage = {};

  client = {};

  create(createSocketioDto: CreateSocketioDto, id: string) {
    const message = {
      name: this.client[id]['user'],
      time: new Date().toISOString(),
      text: createSocketioDto.text,
    };
    console.log('service create : ', message);
    console.log('service create(room) : ', createSocketioDto.room);
    this.roomMessage[createSocketioDto.room].push(message);
    console.log('모든 대화내용 : ', this.roomMessage[createSocketioDto.room]);
    return message;
  }

  findAll(room: string) {
    console.log('Join Room : ', room);
    console.log(
      'Request message Data(SocketioService : findAll) : ',
      this.roomMessage[room],
    );
    if (!this.roomMessage[room]) this.roomMessage[room] = [];
    return this.roomMessage[room];
  }

  joinRoom(
    room: string,
    user: string,
    id: string,
    joinMsg: { name: string; time: string; text: string },
  ) {
    // this.client[id] = user;
    this.client[id] = { user, room };

    if (!this.roomUser[room]) {
      this.roomUser[room] = [];
      this.roomMessage[room] = [];
    }

    this.roomUser[room].push({ id, user });

    this.roomMessage[room].push(joinMsg);
    console.log('Current client : ', this.client);

    return Object.values(this.client);
  }

  getAllUser() {
    return this.client;
  }

  getClientInfo(id: string) {
    return this.client[id];
  }

  disconnectUser(
    id: string,
    disconnectMsg: { name: string; time: string; text: string },
  ) {
    console.log('client has been left : ', this.client[id]);
    this.roomMessage[this.client[id]['room']].push(disconnectMsg);
    this.roomUser[this.client[id]['room']] = this.roomUser[
      this.client[id]['room']
    ].filter((ele) => ele.id !== id);
    delete this.client[id];
    console.log('left client : ', this.client);
    console.log('room left client : ', this.roomMessage);

    return this.client;
  }
}
