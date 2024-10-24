import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

class LoggerService {

    private logger;

    constructor(private context: string) {
        const consoleFormat = format.combine(
            format.colorize(),
            format.timestamp(),
            format.printf(({ timestamp, level, message }) => {
                return `[${timestamp}] [${this.context}] ${level}: ${message}`;
            })
        );

        const fileFormat = format.combine(
            format.timestamp(),
            format.json()
        );

        this.logger = createLogger({
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
    }

    private formatSecondParam(param?: any): string {
        if (param) {
            return `\n${JSON.stringify(param, null, 2)}`;
        }
        return '';
    }

    info(message: string, param?: any) {
        this.logger.info(`${message}${this.formatSecondParam(param)}`);
    }

    error(message: string, param?: any) {
        this.logger.error(`${message}${this.formatSecondParam(param)}`);
    }

    warn(message: string, param?: any) {
        this.logger.warn(`${message}${this.formatSecondParam(param)}`);
    }

    debug(message: string, param?: any) {
        this.logger.debug(`${message}${this.formatSecondParam(param)}`);
    }
}

export default LoggerService;
