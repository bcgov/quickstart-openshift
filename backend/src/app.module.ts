import "dotenv/config";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";

console.log("Var check - PGHOST", process.env.PGHOST);
console.log("Var check - PGDATABASE", process.env.PGDATABASE);
console.log("Var check - PGUSER", process.env.PGUSER);
if (process.env.PGUSER != null ){
  console.log("Var check - PGUSER present");
} else {
  console.log("Var check - PGUSER not present");
}

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
