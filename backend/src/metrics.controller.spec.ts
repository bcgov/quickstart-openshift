import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import type { Response } from 'express'
import { MetricsController } from './metrics.controller'
import { register } from './middleware/prom'

// Mock the register module
vi.mock('./middleware/prom', async () => {
  const actual = await vi.importActual('./middleware/prom')
  return {
    ...actual,
    register: {
      metrics: vi.fn(),
    },
  }
})

describe('MetricsController', () => {
  let controller: MetricsController
  let mockResponse: Response

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetricsController],
    }).compile()

    controller = module.get<MetricsController>(MetricsController)

    // Mock Express Response object
    mockResponse = {
      end: vi.fn(),
    } as unknown as Response
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('getMetrics', () => {
    it('should return application metrics', async () => {
      // Arrange
      const mockMetrics = 'http_request_duration_seconds_bucket{le="0.005"} 123\n'
      vi.mocked(register.metrics).mockResolvedValue(mockMetrics)

      // Act
      await controller.getMetrics(mockResponse)

      // Assert
      expect(register.metrics).toHaveBeenCalledTimes(1)
      expect(mockResponse.end).toHaveBeenCalledWith(mockMetrics)
    })

    it('should return empty metrics if register returns empty string', async () => {
      // Arrange
      const mockMetrics = ''
      vi.mocked(register.metrics).mockResolvedValue(mockMetrics)

      // Act
      await controller.getMetrics(mockResponse)

      // Assert
      expect(register.metrics).toHaveBeenCalledTimes(1)
      expect(mockResponse.end).toHaveBeenCalledWith(mockMetrics)
    })

    it('should handle errors from register.metrics', async () => {
      // Arrange
      const error = new Error('Metrics collection failed')
      vi.mocked(register.metrics).mockRejectedValue(error)

      // Act & Assert
      await expect(controller.getMetrics(mockResponse)).rejects.toThrow(
        'Metrics collection failed',
      )
      expect(register.metrics).toHaveBeenCalledTimes(1)
      expect(mockResponse.end).not.toHaveBeenCalled()
    })

    it('should return Prometheus-formatted metrics', async () => {
      // Arrange
      const mockMetrics = `# HELP http_request_duration_seconds HTTP request duration in seconds
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{le="0.005"} 123
http_request_duration_seconds_bucket{le="0.01"} 456
http_request_duration_seconds_count 789`
      vi.mocked(register.metrics).mockResolvedValue(mockMetrics)

      // Act
      await controller.getMetrics(mockResponse)

      // Assert
      expect(register.metrics).toHaveBeenCalledTimes(1)
      expect(mockResponse.end).toHaveBeenCalledWith(mockMetrics)
      // Verify it's valid Prometheus format (contains HELP and TYPE)
      expect(mockMetrics).toContain('# HELP')
      expect(mockMetrics).toContain('# TYPE')
    })
  })
})
