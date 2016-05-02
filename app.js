var express =       require('express');
var io =      require('socket.io');
var path =          require('path');
var logger =        require('./logger');
var morgan =        require('morgan');
var cookieParser =  require('cookie-parser');
var session =       require('client-sessions');
var bodyParser =    require('body-parser');
var dbActions =     require('./dbActions');

// init express setup
var app = express();
// attach socket.io to app
app.io = io();

// set variables to html pages
var home =          require('./routes/home');
var routes =        require('./routes/index');
var users =         require('./routes/users');
var about =         require('./routes/about');
var myImages =      require('./routes/myImages');
var logout =        require('./routes/logout');
var register =      require('./routes/register');
var socketio =      require('./routes/socketio')(app.io);

app.set('views', path.join(__dirname, 'views'));
app.set('uploads', path.join(__dirname, 'uploads'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//app.use(logger('dev'));
logger.debug("Debug mode set..overriding 'Express' logger");
app.use(morgan("combined", { "stream": logger.stream } ));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/**
 * cookie stuff
 */
//app.use(cookieParser());
app.use(session({
  cookieName: 'session',
  secret: 'eg[isfd-8yF9-7w2315df{}+Ijsli;;to8',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
  httpOnly: true,
  secure: true,
  ephemeral: true
}));

app.use(function(req, res, next) {
  if (req.session && req.session.user) {
    dbActions.getUser(req.session.user.user_name, function(err, user) {
      if (user) {
        req.user = user;
        delete req.user.password; // delete the password from the session
        req.session.user = user;  //refresh the session value
        res.locals.user = user;
      }
      // finishing processing the middleware and run the route
      next();
    });
  } else {
    next();
  }
});


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

// set use for views
app.use('/', routes);
app.use('/home', home);
app.use('/users', users);
app.use('/about', about);
app.use('/myImages', myImages);
app.use('/logout', logout);
app.use('/register', register);
app.use('/socketio', socketio);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

/**
 *
 * @type {*|exports}
 */
module.exports = app;
