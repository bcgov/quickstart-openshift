import "dotenv/config";
import { MiddlewareConsumer, Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule} from "@nestjs/config";
import {AppController} from "./app.controller";
import {AppService} from "./app.service";
import {UsersModule} from "./users/users.module";
import { HTTPLoggerMiddleware } from './middleware/req.res.logger';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.POSTGRESQL_HOST || "127.0.0.1",
      port: 5432,
      database: process.env.POSTGRESQL_DATABASE || "postgres",
      username: process.env.POSTGRESQL_USER || "postgres",
      password: process.env.POSTGRESQL_PASSWORD || "postgres", // helps in UT and e2e testing
      // entities: [User],
      autoLoadEntities: true, // Auto load all entities regiestered by typeorm forFeature method.
      schema: "users",
      //logging: "all"
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { // let's add a middleware on all routes
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HTTPLoggerMiddleware).forRoutes("*");
  }}
