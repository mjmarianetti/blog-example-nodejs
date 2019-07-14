"use strict";

module.exports = (models) => {

    let middlewares = {};

    middlewares.Cors = require('./cors')();
    middlewares.Auth = require('./auth')(models);

    return middlewares;
};