import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { apiReference } from "@scalar/nestjs-api-reference";
import { AppModule } from "./app.module.js";
import { ObserveInstrument } from "./observe.js";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  const config = new DocumentBuilder()
    .setTitle("Pharmix API")
    .setDescription("Documentação da API do Pharmix")
    .setVersion("1.0.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);

  app.use(
    "/docs",
    apiReference({
      content: document,
      theme: "default",
      darkMode: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
