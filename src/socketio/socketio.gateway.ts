// src/socketio/socketio.gateway.ts
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateSocketioDto } from './dto/create-socketio.dto';
import { SocketioService } from './socketio.service';

// Cors에러 방지
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketioGateway {
  @WebSocketServer()
  server: Server; // 서버 셋팅
  constructor(private readonly socketioService: SocketioService) {}

  // SocketIO Controller 로직
  @SubscribeMessage('createSocketio')
  // 유저가 메세지 생성시
  async create(
    @MessageBody() createSocketioDto: CreateSocketioDto,
    @ConnectedSocket() client: Socket,
  ) {
    const message = this.socketioService.create(createSocketioDto, client.id);
    this.server.emit(createSocketioDto.room, message);

    return message;
  }

  @SubscribeMessage('findAllSocketio')
  findAll(
    @ConnectedSocket() client: Socket,
    @MessageBody('room') room: string,
  ) {
    const res = this.socketioService.findAll(room);
    console.log(`Client ${client.id} request all the chat data`);
    return res;
  }

  @SubscribeMessage('join')
  joinRoom(
    @MessageBody('user') user: string,
    @MessageBody('room') room: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log(`${user}(${client.id}) join to the Chat Room`);

    // Client가 접속이 종료될시 동작
    client.on('disconnect', () => {
      const disconnectMsg = {
        name: 'server',
        time: new Date().toISOString(),
        text: `user(${client.id}) ${user} has been disconnected`,
      };
      // Client의 접속 종료를 해당 방에 메세지로 올린다.
      this.server.emit(room, disconnectMsg);
      this.socketioService.disconnectUser(client.id, disconnectMsg);
    });
    const joinMsg = {
      name: 'NestJS-Server',
      time: new Date().toISOString(),
      text: `user ${user}(${client.id}) has join the game`,
    };
    // Client의 접속을 해당 방에 메세지로 올린다.
    this.server.emit(room, joinMsg);
    return this.socketioService.joinRoom(room, user, client.id, joinMsg);
  }
}
