import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SocketioModule } from './socketio/socketio.module';
import { RestApiModule } from './rest-api/rest-api.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
      validationSchema: Joi.object({
        // PG_HOST: Joi.required(),
        // PG_PORT: Joi.number().default(5432),
        NESTJS_PORT: Joi.number().default(5031),
      }),
    }),
    SocketioModule,
    RestApiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
