import { Module } from '@nestjs/common';
import { SocketioGateway } from './socketio.gateway';
import { SocketioService } from './socketio.service';

@Module({
  providers: [SocketioGateway, SocketioService],
  exports: [SocketioGateway, SocketioService],
})
export class SocketioModule {}
