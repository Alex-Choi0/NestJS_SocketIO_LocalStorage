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

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketioGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly socketioService: SocketioService) {}

  @SubscribeMessage('createSocketio')
  async create(
    @MessageBody() createSocketioDto: CreateSocketioDto,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('SubscribeMessage(createSocketio) : ', client.id);
    console.log('SubscribeMessage(createSocketio) room : ', createSocketioDto);
    const message = this.socketioService.create(createSocketioDto, client.id);

    this.server.emit(createSocketioDto.room, message);
    console.log("emit to server 'message' : ", message);

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
    return this.socketioService.joinRoom(room, user, client.id);
  }
}
