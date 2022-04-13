import "dotenv/config";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";

console.log("POSTGRESQL_HOSTNAME", process.env.POSTGRESQL_HOSTNAME);
console.log("POSTGRESQL_DATABASE", process.env.POSTGRESQL_DATABASE);
console.log("POSTGRESQL_USER", process.env.POSTGRESQL_USER);

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.PGHOST || "localhost",
      port: 5432,
      database: process.env.PGDATABASE || "postgres",
      username: process.env.PGUSER || "postgres",
      password: process.env.PGPASSWORD,
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
