import {NestExpressApplication} from "@nestjs/platform-express";
import {bootstrap} from "./app";
import {Logger} from "@nestjs/common";

const logger = new Logger('NestApplication');
bootstrap().then(async (app: NestExpressApplication) => {
  await app.listen(3000);
  logger.log(`Listening on ${await app.getUrl()}`);
}).catch(err=>{
  logger.error(err);
});
