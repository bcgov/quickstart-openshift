import { NestExpressApplication } from "@nestjs/platform-express";
import { bootstrap } from "./app";

vi.mock("prom-client", () => ({
  Registry: vi.fn().mockImplementation(() => ({})),
  collectDefaultMetrics: vi.fn().mockImplementation(() => ({})),
}));
vi.mock("express-prom-bundle", () => ({
  default: vi.fn().mockImplementation(() => ({})),
}));
vi.mock("src/middleware/prom", () => ({
  metricsMiddleware: vi.fn().mockImplementation((_req, _res, next) => next()),
}));

describe("main", () => {
  let app: NestExpressApplication;

  beforeAll(async () => {
    app = await bootstrap();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should start the application", async () => {
    expect(app).toBeDefined();
  });
});
