'use strict';

const config = require('./config/app');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const passport = require('passport');
const app = express();

const logger = require('./helpers/logger')(config);
const ResponseHelper = require('./helpers/response-helper')(logger);

const db = require('./models')();
const routes = require('./routes')(logger, db, passport);

const middlewares = require('./middlewares')(db);

logger.info('Running env:  ' + config.env);
logger.info('Using database:  ' + config.database.database);

app.use(helmet());
app.use(morgan('combined', {
    stream: logger.stream
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//enable cors
app.use(middlewares.Cors.enableCors);


passport.use('signup', middlewares.Auth.signup);
passport.use('login', middlewares.Auth.login);
passport.use(middlewares.Auth.verify);

app.use('/', routes);

app.use((req, res) => {
    return ResponseHelper.notFound(req, res);
});

module.exports = app;