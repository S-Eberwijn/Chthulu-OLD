const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const prodFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level.toUpperCase().padEnd(5)}]: ${message}`;
});

const consoleFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

const currentTime = new Date();
const logger = createLogger({
    level: 'debug',
    format:
        combine(
            timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            prodFormat
        ),
    transports: [
        new transports.File({ filename: `logs/${`${currentTime.toISOString().split('T')[0]}${currentTime.getHours()}${currentTime.getMinutes()}`.replaceAll('-', '')}.log`, level: 'debug' }),
    ],
    exitOnError: false,
});

logger.add(new transports.Console({
    format:
        combine(
            format.colorize(),
            timestamp({ format: "HH:mm:ss" }),
            consoleFormat,
        )
}));


//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
module.exports = { logger };    