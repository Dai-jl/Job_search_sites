var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

var session = require('express-session');
var redisStore = require('connect-redis')(session);
const redis = require('./redis.js').redis

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var indicesRouter = require('./routes/indices');
var jobtypeRouter = require('./routes/jobtype');
var jobRouter = require('./routes/job');
var sessionRouter = require('./routes/session');
var graphglRouter = require('./routes/graphgl')

var app = express();

//session
app.use(session({
  store:new redisStore({
    client:redis,
    prefix:'hgk'
  }),
  cookie:{maxAge:1*60*60*1000},
  secret:'keyboard cat',
  resave:true,
  saveUninitialized:true
}))


//设置允许跨域访问该服务.
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', '*');
  res.header("Access-Control-Allow-Credentials",true);
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/indices',indicesRouter);
app.use('/jobtype',jobtypeRouter);
app.use('/job',jobRouter);
app.use('/session',sessionRouter);
app.use('/graphql',cors(), graphglRouter)

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
