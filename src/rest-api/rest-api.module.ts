import { Module } from '@nestjs/common';
import { SocketioModule } from 'src/socketio/socketio.module';
import { RestApiController } from './rest-api.controller';
import { RestApiService } from './rest-api.service';

@Module({
  imports: [SocketioModule],
  controllers: [RestApiController],
  providers: [RestApiService],
})
export class RestApiModule {}
