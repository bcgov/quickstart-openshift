import * as prom from 'prom-client';
import promBundle from 'express-prom-bundle';
const register = new prom.Registry();
prom.collectDefaultMetrics({ register });
const metricsMiddleware = promBundle({
  includeMethod: true,
  includePath: true,
  metricsPath: '/prom-metrics',
  promRegistry: register,
});
export { metricsMiddleware, register };
