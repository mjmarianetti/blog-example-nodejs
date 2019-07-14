'use strict';

const express = require('express');
const router = express('Router');

module.exports = (logger, models, passport) => {

  const controller = require('../controllers/users')(logger, models, passport);

  const ctrl = new controller();

  router.post('/login', (req, res, next) => ctrl.login(req, res, next));

  router.post('/signup', passport.authenticate('signup', {
    session: false
  }), (req, res, next) => ctrl.signup(req, res, next));


  return router;
};