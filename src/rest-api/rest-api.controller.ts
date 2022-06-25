import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { SocketioService } from 'src/socketio/socketio.service';
import { CreateRestApiDto } from './dto/create-rest-api.dto';
import { UpdateRestApiDto } from './dto/update-rest-api.dto';
import { RestApiService } from './rest-api.service';

@Controller('rest-api')
export class RestApiController {
  constructor(
    private readonly restApiService: RestApiService,
    private readonly socketIOService: SocketioService,
  ) {}

  @Post()
  create(@Body() createRestApiDto: CreateRestApiDto) {
    return this.restApiService.create(createRestApiDto);
  }

  @Get()
  findAll() {
    return this.socketIOService.getAllUser();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restApiService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRestApiDto: UpdateRestApiDto) {
    return this.restApiService.update(+id, updateRestApiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.restApiService.remove(+id);
  }
}
