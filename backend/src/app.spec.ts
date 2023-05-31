import {NestExpressApplication} from '@nestjs/platform-express';
import {bootstrap} from "./app";

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
