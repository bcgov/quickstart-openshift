import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class PrismaModule {}
