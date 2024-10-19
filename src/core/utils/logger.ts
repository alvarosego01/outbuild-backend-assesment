
import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';


const consoleFormat = format.combine(
  format.colorize(),
  format.timestamp(),
  format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level}: ${message}`;
  })
);


const fileFormat = format.combine(
  format.timestamp(),
  format.json()
);


const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.errors({ stack: true }),
    format.timestamp()
  ),
  transports: [

    new transports.Console({
      format: consoleFormat,
      level: 'debug'
    }),

    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: fileFormat
    }),

    new transports.DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: fileFormat
    })
  ],
  exitOnError: false,
});


export default logger;
