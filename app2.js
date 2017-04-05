var http = require('http')
  , express = require('express')
  , app = express()
  , server = http.createServer(app)
  , io = require('socket.io')(server)

app.engine('jade', require('jade').__express) //__
app.set('view engine', 'jade')

app.get('/', function (req, res) {
  res.render('index')
})

var count = 0

io.on('connection', function (socket) {
  count++
  console.log('new connection...');

  io.emit('news', { msg: 'One more person is online', count: count })
  socket.emit('private', { msg: 'Welcome you are the ' + count + ' person here' })

  socket.on('private', function (data) {
    console.log(data);
  })

  socket.on('disconnect', function() {
    count--
    io.emit('news', { msg: 'Someone went home', count: count })
  })
})

server.listen(4000, function() {
  console.log('Listening on port 3000...')
})