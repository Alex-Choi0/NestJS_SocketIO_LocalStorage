import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const options = new DocumentBuilder()
    .setTitle('Playin_RPG_SoketIO')
    .setVersion('1.0')
    // .addTag(
    //   '소켓IO테스트를 위한 서버',
    //   '간단한 소켓IO테스트 서버입니다. 향후 Playin_RPG의 데이터를 받을수 있는지 확인하기 위한 테스트 서버 입니다.',
    // )
    // .addTag(
    //   '테스트 방법',
    //   `디폴트 포트는 5035입니다.
    //   처음 접속시 유저 이름을 정해야 합니다. 이후 유저 이름과 해당 클라이언트 id를 갖이 저장하여 채팅글을 띄워줍니다.

    //   `,
    // )
    .setDescription(
      `
    소켓IO테스트를 위한 서버
    - 간단한 소켓IO테스트 서버입니다. 향후 Playin_RPG의 데이터를 받을수 있는지 확인하기 위한 테스트 서버 입니다.

    테스트 방법
    - 디폴트 포트는 5031입니다.
     처음 접속시 유저 이름을 정해야 합니다. 이후 유저 이름과 해당 클라이언트 id를 갖이 저장하여 채팅글을 띄워줍니다.
    - Sample로 제작한 Vue프로그램이 있습니다. 간단하게 현재 서버를 이용하여 테스트를 할수 있습니다. 해당 Vue프로그램은 socket url을 해당 서버에 맞춰야 합니다. ex : http://localhost:5031
    gitHub주소 : https://github.com/Alex-Choi0/Test_SocketIO_Vue.git
    branch : select_room
    `,
    )
    .addBearerAuth()
    .build();

  // Swagger Document의 문서를 api(/api-docs)로 설정할수 있게 셋팅
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.NESTJS_PORT);
  console.log('SERVER PORT : ', process.env.NESTJS_PORT);
}
bootstrap();
