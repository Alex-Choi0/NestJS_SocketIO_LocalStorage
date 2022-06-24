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
  msg = { name: 'NestJS-SocketIO', time : new Date().toISOString() ,text: 'Starting SocketIO Communication' }
  constructor(private readonly socketioService: SocketioService) {}

  @SubscribeMessage('createSocketio')
  async create(
    @MessageBody() createSocketioDto: CreateSocketioDto,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('SubscribeMessage(createSocketio) : ', client.id);
    console.log('SubscribeMessage(createSocketio) room : ', createSocketioDto);
    // console.log('server soketId : ', this.server.sockets.sockets.entries())
    const message = this.socketioService.create(createSocketioDto, client.id);
    console.log(`${client.id} : ${this.socketioService.getClientInfo(client.id)}`)
    this.server.emit(createSocketioDto.room, message);
    this.server.to(client.id).emit(createSocketioDto.room,this.msg)
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
    return res
  }

  @SubscribeMessage('join')
  joinRoom(
    @MessageBody('user') user: string,
    @MessageBody('room') room: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log(`${user}(${client.id}) join to the Chat Room`);
    client.on('disconnect', () => {
      this.server.emit(room, {name : 'server', time : new Date().toISOString(), text : `user(${client.id}) ${user} has been disconnected`});
      this.socketioService.disconnectUser(client.id); 
    })
    // client.join(room);
    return this.socketioService.joinRoom(room, user, client.id);
  }

  sendOneUser(@ConnectedSocket() client: Socket, room : string){
  }
}
