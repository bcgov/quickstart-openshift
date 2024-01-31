import { Controller, Get, Res } from "@nestjs/common";
import { Response } from "express";
import { register } from "./prom";
import { PrismaService } from "nestjs-prisma";
@Controller("metrics")
export class MetricsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getMetrics(@Res() res: Response) {
    const prismaMetrics = await this.prisma.$metrics.prometheus();
    const appMetrics = await register.metrics();
    res.end(prismaMetrics + appMetrics);
  }
}
