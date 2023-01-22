import { WinstonModule, utilities } from 'nest-winston';
import * as winston from 'winston';

const globalLoggerFormat = winston.format.timestamp({format:"YYYY-MM-DD hh:mm:ss.SSS"});

const localLoggerFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.align(),
  utilities.format.nestLike('Backend', { prettyPrint: true })
);


export const customLogger = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      level: 'silly',
      format: winston.format.combine(
        globalLoggerFormat,
       localLoggerFormat
      ),
    }),
  ],
  exitOnError: false,
});
