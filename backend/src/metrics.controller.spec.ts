import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { MetricsController } from './metrics.controller'
import type { INestApplication } from '@nestjs/common'
import request from 'supertest'

// Mock the prom middleware
vi.mock('src/middleware/prom', () => {
  const mockRegister = {
    metrics: vi.fn(),
  }
  return {
    register: mockRegister,
  }
})

describe('MetricsController', () => {
  let controller: MetricsController
  let app: INestApplication

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetricsController],
    }).compile()

    controller = module.get<MetricsController>(MetricsController)
    app = module.createNestApplication()
    await app.init()
  })

  afterEach(async () => {
    await app.close()
    vi.clearAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('GET /metrics', () => {
    it('should return metrics from prometheus register', async () => {
      // Arrange
      const mockMetrics = 'http_requests_total 100\nhttp_requests_duration_seconds 0.5'
      const { register } = await import('src/middleware/prom')
      vi.mocked(register.metrics).mockResolvedValue(mockMetrics)

      // Act & Assert
      return request(app.getHttpServer())
        .get('/metrics')
        .expect(200)
        .expect(mockMetrics)
        .then(() => {
          expect(register.metrics).toHaveBeenCalledTimes(1)
        })
    })

    it('should handle errors when metrics collection fails', async () => {
      // Arrange
      const { register } = await import('src/middleware/prom')
      vi.mocked(register.metrics).mockRejectedValue(new Error('Metrics collection failed'))

      // Act & Assert
      return request(app.getHttpServer())
        .get('/metrics')
        .expect(500)
        .then(() => {
          expect(register.metrics).toHaveBeenCalledTimes(1)
        })
    })
  })
})
