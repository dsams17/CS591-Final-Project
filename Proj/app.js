const createError = require('http-errors');
const express = require('express');
const path = require('path');
const request = require('request'); // "Request" library
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


const usersRouter   = require('./routes/users');
const spotifyRouter = require('./routes/spotify');
const watsonRouter = require('./routes/watson');

const cors = require('cors');

let app = express();

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
app.use('/', spotifyRouter);
app.use('/watson', watsonRouter);




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
app.disable('etag');

module.exports = app;