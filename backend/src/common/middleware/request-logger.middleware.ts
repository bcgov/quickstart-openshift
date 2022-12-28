import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

// reference: https://stackoverflow.com/questions/55093055/logging-request-response-in-nest-js

@Injectable()
export class HTTPLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      const localHttpLogFormat = `${method} ${originalUrl} ${statusCode} ${contentLength}`;
      const hostedHttpLogFormat = `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent}`;

      this.logger.log(
        process.env.RUNTIME_ENV === 'local' ? localHttpLogFormat : hostedHttpLogFormat
      );
    });

    next();
  }
}
