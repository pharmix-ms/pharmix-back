import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 3001;

  // 🔥 SWAGGER CONFIG
  const swaggerConfig = new DocumentBuilder()
    .setTitle('🚀 Pharmix API')
    .setDescription('Documentação da API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // 🔥 salva token
    },
  });

  await app.listen(port);

  console.log(
    `\x1b[32m[Nest]\x1b[0m Server rodando em: \x1b[34mhttp://localhost:${port}\x1b[0m`,
  );
  console.log(
    `\x1b[32m[Nest]\x1b[0m Swagger em: \x1b[34mhttp://localhost:${port}/api\x1b[0m`,
  );
}

bootstrap();
