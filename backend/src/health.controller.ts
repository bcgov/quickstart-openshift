import { Controller, Get } from '@nestjs/common'
import type { HealthCheckService, PrismaHealthIndicator } from '@nestjs/terminus'
import { HealthCheck } from '@nestjs/terminus'
import type { PrismaService } from 'src/prisma.service'
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prisma: PrismaHealthIndicator,
    private readonly prismaService: PrismaService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([() => this.prisma.pingCheck('prisma', this.prismaService)])
  }
}
