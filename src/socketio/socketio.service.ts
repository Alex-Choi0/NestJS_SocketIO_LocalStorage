import { Injectable } from '@nestjs/common';
import { CreateSocketioDto } from './dto/create-socketio.dto';

@Injectable()
export class SocketioService {
  // messages: Socketio[] = [
  //   { name: 'NestJS-SocketIO', text: 'Starting SocketIO Communication' },
  // ];

  room = {};

  client = {};

  create(createSocketioDto: CreateSocketioDto, id: string) {
    const message = {
      name: this.client[id],
      time: new Date().toISOString(),
      text: createSocketioDto.text,
    };
    console.log('service create : ', message);
    console.log('service create(room) : ', createSocketioDto.room);
    this.room[createSocketioDto.room].push(message);
    console.log("모든 대화내용 : ", this.room[createSocketioDto.room]);
    return message;
  }

  findAll(room: string) {
    console.log('Join Room : ', room);
    console.log(
      'Request message Data(SocketioService : findAll) : ',
      this.room[room],
    );
    if (!this.room[room]) this.room[room] = [];
    return this.room[room];
  }

  joinRoom(room: string, user: string, id: string) {
    this.client[id] = user;
    console.log('Current Room user :', this.client);
    return Object.values(this.client);
  }

  getAllUser(){
    return this.client
  }

  getClientInfo(id : string){
    return this.client[id];
  }

  disconnectUser(id : string){
    delete this.client[id];
    console.log("left client : ", this.client);
    return this.client;
  }
}
