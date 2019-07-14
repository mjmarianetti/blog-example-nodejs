"use strict";
const config = require('../config/app');
const mongoose = require('mongoose');
const logger = require('../helpers/logger')(config);

module.exports = () => {

    mongoose.set('debug', config.application.debugEnabled);

    mongoose.connect(config.database.host, config.database.options);
    mongoose.connection.on('error', (err) => {
        if (config.application.debugEnabled) {
            logger.error.bind(console, 'MongoDB connection error:', err)
        }
    });
    mongoose.connection.once('open', () => {
        if (config.application.debugEnabled) {
            logger.info("Connected successfully to database");
        }
    });

    mongoose.model('Post', require('./post')(mongoose), 'posts');
    mongoose.model('User', require('./user')(mongoose), 'users');

    return mongoose;
};