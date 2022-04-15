import "dotenv/config";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";

console.log("Var check - PG_HOST", process.env.PG_HOST);
console.log("Var check - PG_DATABASE", process.env.PG_DATABASE);
console.log("Var check - PG_USER", process.env.PG_USER);
if (process.env.PG_PASSWORD != null ){
  console.log("Var check - PG_PASSWORD present");
} else {
  console.log("Var check - PG_PASSWORD not present");
}

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.PG_HOST || "localhost",
      port: 5432,
      database: process.env.PG_DATABASE || "postgres",
      username: process.env.PG_USER || "postgres",
      password: process.env.PG_PASSWORD,
      // entities: [User],
      autoLoadEntities: true, // Auto load all entities regiestered by typeorm forFeature method.
      synchronize: true, // This changes the DB schema to match changes to entities, which we might not want.
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
