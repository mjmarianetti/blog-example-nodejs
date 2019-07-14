"use strict";

module.exports = (models,passport) => {

    let middlewares = {};

    middlewares.Cors = require('./cors')();
    middlewares.Auth = require('./auth')(models,passport);

    return middlewares;
};