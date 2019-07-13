'use strict';

const winston = require('winston');

module.exports = (config) => {

    const myFormat = winston.format.printf(info => {
        if (info.message instanceof Object) {
            info.message = JSON.stringify(info.message);
        }
        return `[${info.timestamp}]${info.level}: ${info.message}`;
    });

    const options = {
        console: {
            level: config.application.debugLevel || 'debug',
            handleExceptions: true,
            json: false,
            colorize: true,
            timestamp: true,
            format: winston.format.combine(
                winston.format.splat(),
                winston.format.colorize(),
                winston.format.timestamp(),
                myFormat //winston.format.json()
            )
        }
    };

    const logger = winston.createLogger({
        transports: [
            new winston
            .transports
            .Console(options.console)
        ],
        exitOnError: false, // do not exit on handled exceptions
    });

    logger.stream = {
        write: (message) => {
            logger.info(message);
        }
    };
    return logger;
};