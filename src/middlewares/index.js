"use strict";

module.exports = () => {

    let middlewares = {};

    middlewares.Cors = require('./cors')();

    return middlewares;
};