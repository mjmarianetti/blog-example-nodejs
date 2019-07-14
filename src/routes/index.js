'use strict';

const express = require('express');
const router = express('Router');

module.exports = (logger, models, passport) => {

    const posts = require('./posts')(logger, models, passport);
    router.use('/posts', posts);


    const users = require('./users')(logger, models, passport);
    router.use('/users', users);

    return router;
};