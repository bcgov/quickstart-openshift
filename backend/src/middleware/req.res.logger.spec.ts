import {Test} from '@nestjs/testing';
import {HTTPLoggerMiddleware} from './req.res.logger';
import {Request, Response} from 'express';
import {Logger} from '@nestjs/common';

describe('HTTPLoggerMiddleware', () => {
  let middleware: HTTPLoggerMiddleware;
  let logger: Logger;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [HTTPLoggerMiddleware, Logger],
    }).compile();

    middleware = module.get<HTTPLoggerMiddleware>(HTTPLoggerMiddleware);
    logger = module.get<Logger>(Logger);
  });
  it('should log the correct information', () => {
    const request: Request = {
      method: 'GET',
      originalUrl: '/test',
      get: () => 'Test User Agent'
    } as unknown as Request;

    const response: Response = {
      statusCode: 200,
      get: () => '100',
      on: (event: string, cb: () => void) => {
        if (event === 'finish') {
          cb();
        }
      }
    } as unknown as Response;

    const loggerSpy = jest.spyOn(middleware['logger'], 'log');

    middleware.use(request, response, () => {
    });

    expect(loggerSpy).toHaveBeenCalledWith(`GET /test 200 100 - Test User Agent`);
  });
});
