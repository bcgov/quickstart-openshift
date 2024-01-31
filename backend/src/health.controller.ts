import { Controller, Get } from "@nestjs/common";
import { HealthCheckService, HealthCheck, PrismaHealthIndicator } from "@nestjs/terminus";
import { PrismaService } from "nestjs-prisma";
@Controller("health")
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prisma: PrismaHealthIndicator,
    private readonly prismaService: PrismaService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.prisma.pingCheck('prisma', this.prismaService),
    ]);
  }
}
