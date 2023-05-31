import {NestExpressApplication} from "@nestjs/platform-express";
import {bootstrap} from "./app";
import {Logger} from "@nestjs/common";


bootstrap().then(async (app: NestExpressApplication) => {
  await app.listen(3000);
  const logger = new Logger('NestApplication');
  logger.log(`Listening on ${await app.getUrl()}`);
});
