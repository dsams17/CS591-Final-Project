var createError = require('http-errors');
var express = require('express');
var path = require('path');
var request = require('request'); // "Request" library
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var usersRouter   = require('./routes/users');
var compRouter    = require('./routes/compare');
var spotifyRouter = require('./routes/spotify');

var cors = require('cors');

var app = express();

app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//serve index
app.use(express.static(path.join(__dirname, 'public')));

//api's
app.use('/users', usersRouter);
app.use('/comparisons', compRouter);
app.use('/', spotifyRouter);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;