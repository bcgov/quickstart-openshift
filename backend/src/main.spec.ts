import {NestExpressApplication} from '@nestjs/platform-express';
import {Test, TestingModule} from '@nestjs/testing';
import {AppModule} from './app.module';
import {customLogger} from './common/logger.config';
import {bootstrap} from './main';

describe('main', () => {
  let app: NestExpressApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication<NestExpressApplication>();
    app.useLogger(customLogger);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should start the application', async () => {
    const spy = jest.spyOn(app, 'listen');
    await bootstrap();
    expect(spy).toHaveBeenCalledWith(3000);
  });
});
