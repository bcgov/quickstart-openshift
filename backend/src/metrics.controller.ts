import { Controller, Get, Res } from '@nestjs/common'
import type { Response } from 'express'
import { register } from 'src/middleware/prom'
import { PrismaService } from 'src/prisma.service'
@Controller('metrics')
export class MetricsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getMetrics(@Res() res: Response) {
    // Prisma $metrics API was deprecated in 6.14+ and removed in 7.0
    // Return application metrics only
    const appMetrics = await register.metrics()
    res.end(appMetrics)
  }
}
