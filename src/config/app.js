'use strict';

const config = {
    env: process.env.APP_ENV || 'development',
    application: {
        name: process.env.APP_NAME,
        host: process.env.APP_URL,
        port: process.env.APP_PORT || parseInt(3000, 10),
        debugLevel: process.env.APP_DEBUG || 'debug',
        debugEnabled: (process.env.APP_DEBUG_ENABLED !== undefined) ? process.env.APP_DEBUG_ENABLED : true,
    },
    database: {
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
        options: {
            useNewUrlParser: true,
        }
    },
    key: process.env.APP_KEY
};

module.exports = config;