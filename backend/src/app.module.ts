import "dotenv/config";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";

console.log("Var check - POSTGRESQL_HOST", process.env.POSTGRESQL_HOST);
console.log("Var check - POSTGRESQL_DATABASE", process.env.POSTGRESQL_DATABASE);
console.log("Var check - POSTGRESQL_USER", process.env.POSTGRESQL_USER);
if (process.env.POSTGRESQL_PASSWORD != null ){
  console.log("Var check - POSTGRESQL_PASSWORD present");
} else {
  console.log("Var check - POSTGRESQL_PASSWORD not present");
}

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.POSTGRESQL_HOST || "localhost",
      port: 5432,
      database: process.env.POSTGRESQL_DATABASE || "postgres",
      username: process.env.POSTGRESQL_USER || "postgres",
      password: process.env.POSTGRESQL_PASSWORD,
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
