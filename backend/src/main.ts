import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import {customLogger} from "./common/logger.config";
import helmet from 'helmet';
import {Logger} from "@nestjs/common";
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: customLogger,
  });
  app.use(
    helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false, }),
  );
  app.enableCors();
  app.enableShutdownHooks();
  const config = new DocumentBuilder()
    .setTitle("Users example")
    .setDescription("The user API description")
    .setVersion("1.0")
    .addTag("users")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(3000);
  const logger = new Logger('NestApplication');
  logger.log(`Listening on ${await app.getUrl()}`);
}
bootstrap();
