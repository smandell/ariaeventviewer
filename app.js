var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);

var routes = require('./routes/index');
var users = require('./routes/users');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//read all of the request body and format it into utf-8. This gives us the raw xml from the request
function anyBodyParser(req, res, next) {
    var data = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk) { 
        data += chunk;
    });
    req.on('end', function() {
        req.rawBody = data;
        next();
    });
}

app.use(anyBodyParser);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
//app.use(bodyParser.text({ type: 'text'}));
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//handle websockets 
//tutorials:
//https://www.terlici.com/2015/11/26/realtime-node-expressjs-with-websockets.html
//http://www.programwitherik.com/socket-io-tutorial-with-node-js-and-express/

//TO FIX: using a global variable now until I figure out how to do somemthing cleaner
socketList = [];

io.on('connection', (socket) => {
  console.log("just recieved a new socket connection");
  socketList.push(socket);
});

var port = process.env.PORT || '3000';
server.listen(port, function() {
  console.log('Listening on port ' + port + '...')
})


app.use('/', routes);
app.use('/users', users);


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


module.exports = app;
