/**
 * @author: Vikram Viswanathan
 * @version: 1.0.0
 * @date: September 28, 2018
 * @Description: This would be first file being accessed by the NodeJS server when it powers up.
 */

 /**
 * Usage of strict mode
 * 1. It catches some common coding bloopers, throwing exceptions.
 * 2. It prevents, or throws errors, when relatively “unsafe” actions are taken (such as gaining access to the global object).
 * 3. It disables features that are confusing or poorly thought out.
 */ 
'use strict';

var createError = require('http-errors'),
    express = require('express'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    logger = require('morgan'),
    swaggerJSDoc = require('swagger-jsdoc'),
    Promise = require('bluebird');
    const cors = require('cors');

var indexRouter = require('./routes/index');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// swagger definition
var swaggerDefinition = {
  info: {
    title: 'Bhamashah Wallet API',
    version: '1.0.0',
    description: 'Providing the list of APIs developed for Bhamashah Wallet project.',
  },
  host: 'localhost:4000',
  basePath: '/',
};

// options for the swagger docs
var options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ['./routes/swagger-docs.js'],
};

// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options);

// serve swagger
app.get('/swagger.json', function(request, response) {
  response.setHeader('Content-Type', 'application/json');
  response.send(swaggerSpec);
});

app.use(cors({origin: 'http://localhost'}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(request,response,next) {
  next(createError(404));
});

// error handler
app.use(function(error, request, response, next) {
  // set locals, only providing error in development
  response.locals.message = error.message;
  response.locals.error = request.app.get('env') === 'development' ? error : {};
  // render the error page
  response.status(error.status || 500);
  response.render('error');
});

module.exports = app;