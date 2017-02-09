var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session =  require('express-session');
var index = require('./routes/index');
//var users = require('./routes/users');
var signup = require('./routes/signup');
var login = require('./routes/login');
var logout = require('./routes/logout');
var passport = require('passport');
var authentication = require('./services/authentification');
var songs = require('./routes/songs');
var methodOverride = require('method-override');
var app = express();
app.use(session({
  secret: 'keyboard cat', resave: true, saveUninitialized: true
}))
const verifyAuth = (req, res, next) => {
  if (req.originalUrl === '/signup' || req.originalUrl === '/login' ||req.originalUrl === '/') {
      return next();
  }
  if (req.isAuthenticated()) {
      return next();
  }
  if (req.accepts('text/html')) {
       return res.redirect('/login');
  }
  if (req.accepts('application/json')) {
       res.set('Location', '/login');
       return res.status(401).send({err: 'User should be logged'});
} };

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
passport.use(authentication.songApiLocalStrategy());
app.use(passport.initialize());
app.use(passport.session());

app.all('*', verifyAuth);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
//app.use('/users', users);
app.use('/signup',signup);
app.use('/login',login);
app.use('/logout',logout);

app.use('/songs', songs);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
