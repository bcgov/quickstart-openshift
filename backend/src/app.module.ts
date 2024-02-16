import "dotenv/config";
import { Logger, MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { HTTPLoggerMiddleware } from "./middleware/req.res.logger";
import { loggingMiddleware, PrismaModule } from "nestjs-prisma";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { AppService } from "./app.service";
import { AppController } from "./app.controller";
import { MetricsController } from "./metrics.controller";
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from "./health.controller";

const DB_HOST = process.env.POSTGRES_HOST || "localhost";
const DB_USER = process.env.POSTGRES_USER || "postgres";
const DB_PWD = encodeURIComponent(process.env.POSTGRES_PASSWORD || "default"); // this needs to be encoded, if the password contains special characters it will break connection string.
const DB_PORT = process.env.POSTGRES_PORT || 5432;
const DB_NAME = process.env.POSTGRES_DATABASE || "postgres";
const DB_SCHEMA = process.env.DB_SCHEMA || "users";
const dataSourceURL = `postgresql://${DB_USER}:${DB_PWD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=${DB_SCHEMA}&connection_limit=5`;
function getMiddlewares() {
  if (process.env.PRISMA_LOGGING) {
    return [
      // configure your prisma middleware
      loggingMiddleware({
        logger: new Logger("PrismaMiddleware"),
        logLevel: "debug"
      })
    ];
  }
  return [];
}

@Module({
  imports: [
    ConfigModule.forRoot(),
    TerminusModule,
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions:{
        prismaOptions:{
          log: ["error", "warn"],
          errorFormat: "pretty",
          datasourceUrl: `postgresql://${DB_USER}:${DB_PWD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=${DB_SCHEMA}&connection_limit=5`,
        },
        middlewares: getMiddlewares(),
      },
    }),
    UsersModule
  ],
  controllers: [AppController,MetricsController, HealthController],
  providers: [AppService]
})
export class AppModule { // let's add a middleware on all routes
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HTTPLoggerMiddleware).exclude({ path: 'metrics', method: RequestMethod.ALL }, { path: 'health', method: RequestMethod.ALL }).forRoutes('*');
  }
}
