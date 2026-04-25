import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove campos que não estão no DTO
      forbidNonWhitelisted: true, // Retorna erro se enviarem campos extras
      transform: true, // Transforma os tipos automaticamente
    }),
  );
  const config = app.get(ConfigService);
  const port = config.get<number>('PORT');
  await app.listen(port ?? 3001);
  console.log(`Server is running on port ${port}`);
}
void bootstrap();
