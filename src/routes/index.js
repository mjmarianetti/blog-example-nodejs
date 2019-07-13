'use strict';

const express = require('express');
const router = express('Router');

module.exports = (logger, models) => {

    const posts = require('./posts')(logger, models);
    router.use('/posts', posts);

    return router;
};