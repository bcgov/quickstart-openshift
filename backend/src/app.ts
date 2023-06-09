import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { customLogger } from './common/logger.config';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { VersioningType } from '@nestjs/common';

/**
 *
 */
export async function bootstrap() {
  const app: NestExpressApplication =
    await NestFactory.create<NestExpressApplication>(AppModule, {
      logger: customLogger,
    });
  app.use(helmet());
  app.enableCors();
  app.set("trust proxy", 1);
  app.enableShutdownHooks();
  app.setGlobalPrefix("api");
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: "v",
  });
  const config = new DocumentBuilder()
    .setTitle("Users example")
    .setDescription("The user API description")
    .setVersion("1.0")
    .addTag("users")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);
  return app;
}
