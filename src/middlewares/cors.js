"use strict";

const enableCors = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Strict-Transport-Security, X-Content-Type-Options, X-DNS-Prefetch-Control,X-Download-Options, X-Frame-Options, X-XSS-Protection');

    //intercepts OPTIONS method
    if ('OPTIONS' === req.method) {
        //respond with 200
        res.sendStatus(200);
    } else {
        //move on
        next();
    }
};

module.exports = () => {

    let cors = {};

    cors.enableCors = enableCors;

    return cors;
};