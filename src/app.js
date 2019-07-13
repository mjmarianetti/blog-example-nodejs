'use strict';

const config = require('./config/app');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const mongoose = require('mongoose');
const app = express();

const logger = require('./helpers/logger')(config);
const ResponseHelper = require('./helpers/response-helper')(logger);

const models = require('./models')(mongoose);
const routes = require('./routes')(logger, models);

const middlewares = require('./middlewares')();

mongoose.set('debug', true);
mongoose.connect(config.database.host, config.database.options);
mongoose.connection.on('error', logger.error.bind(console, 'MongoDB connection error:'));
mongoose.connection.once('open', () => {
    logger.info("Connected successfully to database");
});

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

app.use('/', routes);

app.use((req, res) => {
    return ResponseHelper.notFound(req, res);
});

module.exports = app;