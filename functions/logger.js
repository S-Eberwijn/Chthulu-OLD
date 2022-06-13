const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const prodFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level.toUpperCase().padEnd(5)}]: ${message}`;
});

const consoleFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

const logger = createLogger({
    level: 'debug',
    format:
        combine(
            timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            prodFormat
        ),
    // defaultMeta: { service: 'user-service' },
    transports: [
        new transports.File({ filename: 'logs/error.log', level: 'info' }),
    ],
    exitOnError: false,
});
if (process.env.APP_ENV !== 'PROD') {
    logger.add(new transports.Console({
        format:
            combine(
                format.colorize(),
                timestamp({ format: "HH:mm:ss" }),
                consoleFormat,
            )
    }));
}

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
module.exports = { logger };    