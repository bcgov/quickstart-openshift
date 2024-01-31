import {NestExpressApplication} from '@nestjs/platform-express';
import {bootstrap} from "./app";
jest.mock('prom-client', () => ({
  Registry: jest.fn().mockImplementation(() => ({
  })),
  collectDefaultMetrics: jest.fn().mockImplementation(() => ({
  })),
}));
jest.mock('express-prom-bundle', () => ({
  default: jest.fn().mockImplementation(() => ({
  })),
}));
jest.mock('./prom', () => ({
  metricsMiddleware: jest.fn().mockImplementation((req, res, next) => next()),
}));
describe('main', () => {
  let app: NestExpressApplication;

  beforeAll(async () => {
    app = await bootstrap();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should start the application', async () => {
    expect(app).toBeDefined();
  });
});
