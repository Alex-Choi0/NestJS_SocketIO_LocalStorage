// src/socketio/socketio.service.ts
import { Injectable } from '@nestjs/common';
import { CreateSocketioDto } from './dto/create-socketio.dto';

@Injectable()
export class SocketioService {
  // 현재 서버에 참여하고 있는 유저와 ClientID를  참여한 방으로 나타냅니다.
  roomUser = {};

  // 각 방의 메세지를 저장합니다.
  roomMessage = {};

  // ClientId 및 유저이름
  client = {};

  // 대화 내용을 각 방에 맞춰서 저장합니다.
  create(createSocketioDto: CreateSocketioDto, id: string) {
    const message = {
      name: this.client[id]['user'],
      time: new Date().toISOString(),
      text: createSocketioDto.text,
    };
    this.roomMessage[createSocketioDto.room].push(message);
    return message;
  }

  // 해당 방에 대한 이전 기록을 반환합니다.
  findAll(room: string) {
    return this.roomMessage[room];
  }

  // 해당 방에 참여한 유저에 대한 정보를 저장합니다.
  joinRoom(
    room: string,
    user: string,
    id: string,
    joinMsg: { name: string; time: string; text: string },
  ) {
    //client Object에 clientId를 기로 유저와 방을 저장합니다.
    this.client[id] = { user, room };

    // 만약 방이 처음 생성 된 것이면 실행합니다.
    if (!this.roomUser[room]) {
      // 해당 방에 들어갈 빈 배열 생성
      this.roomUser[room] = [];

      // 해당 방에 들어갈 메세지 빈 배열 생성
      this.roomMessage[room] = [];
    }

    // 해당 방에 들어갈 유저의 ClientId와 유저 이름을 배열로 push 해줍니다.
    this.roomUser[room].push({ id, user });

    // 해당 방에 들어갈 메세지에서 서버에서 보낸 참여자 정보 메세지를 roomMessage배열에 저장합니다.
    this.roomMessage[room].push(joinMsg);

    return Object.values(this.client);
  }

  // 현재 서버에 참여한 모든 유저정보
  getAllUser() {
    return this.client;
  }

  // ClientId를 이용하여 확인한 유저 정보
  getClientInfo(id: string) {
    return this.client[id];
  }

  // 유저가 접속이 종료시 실행할 비즈니스 로직
  disconnectUser(
    id: string,
    disconnectMsg: { name: string; time: string; text: string },
  ) {
    this.roomMessage[this.client[id]['room']].push(disconnectMsg);
    // DB roomUser에서 접속이 종료된 유저를 삭제 한다.
    this.roomUser[this.client[id]['room']] = this.roomUser[
      this.client[id]['room']
    ].filter((ele) => ele.id !== id);
    // DB client에서 해당 id를 삭제
    delete this.client[id];
    return this.client;
  }
}
