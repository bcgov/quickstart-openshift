import type { Request, Response, NextFunction } from "express";
import type { NestMiddleware } from "@nestjs/common";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class HTTPLoggerMiddleware implements NestMiddleware {
  private logger = new Logger("HTTP");

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl } = request;

    response.on("finish", () => {
      const { statusCode } = response;
      const contentLength = response.get("content-length") || "-";
      const hostedHttpLogFormat = `${method} ${originalUrl} ${statusCode} ${contentLength} - ${request.get(
        "user-agent",
      )}`;
      this.logger.log(hostedHttpLogFormat);
    });
    next();
  }
}
