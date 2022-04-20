import "dotenv/config";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";

console.log("Var check - POSTGRES_HOST", process.env.POSTGRES_HOST);
console.log("Var check - POSTGRES_DB", process.env.POSTGRES_DB);
console.log("Var check - POSTGRES_USER", process.env.POSTGRES_USER);
if (process.env.POSTGRES_PASSWORD != null ){
  console.log("Var check - POSTGRES_PASSWORD present");
} else {
  console.log("Var check - POSTGRES_PASSWORD not present");
}

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.POSTGRES_HOST || "localhost",
      port: 5432,
      database: process.env.POSTGRES_DB || "postgres",
      username: process.env.POSTGRES_USER || "postgres",
      password: process.env.POSTGRES_PASSWORD,
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
