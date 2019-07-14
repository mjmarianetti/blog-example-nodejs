'use strict';

const express = require('express');
const router = express('Router');

module.exports = (logger, models, passport) => {

    const controller = require('../controllers/posts')(logger, models);
    const middlewares = require('../middlewares')(models,passport);


    const ctrl = new controller();

    router.get('/', (req, res, next) => ctrl.list(req, res, next));

    router.get('/:id', middlewares.Auth.loadUser, (req, res, next) => ctrl.get(req, res, next));

    router.post('/', passport.authenticate('jwt', {
        session: false
    }), (req, res, next) => ctrl.post(req, res, next));

    router.put('/:id', passport.authenticate('jwt', {
        session: false
    }), (req, res, next) => ctrl.put(req, res, next));

    router.delete('/:id', passport.authenticate('jwt', {
        session: false
    }), (req, res, next) => ctrl.delete(req, res, next));

    router.param('id', (req, res, next) => ctrl.param(req, res, next));

    return router;
};