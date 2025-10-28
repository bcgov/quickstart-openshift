import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { PrismaModule } from "src/prisma.module";

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [PrismaModule],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class UsersModule {}
