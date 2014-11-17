"use strict";

var opinion = require('opinion');
var _ = require('lodash');
var SocketHandler = require('./src/SocketHandler');
var app = opinion({
  middlewareOrder: opinion.DEFAULT_MIDDLEWARE_STACK, // this can be manipulated
  // here are some configurations, both general, and middleware specific (by name)
  keys: ['78fd9fe83f2af46f2a8b567154db8d2a'],
  statics: 'public',
  render: ['views', 'jade'],
  socketio: { clientPath: '/js/socket.io.js' }
});

var locals = require('koa-locals');
locals(app, {title: 'TDM'});


app.get('/', function* () {
  yield this.render('index');
});

app.get('/client', function* () {
  yield this.render('client');
});


//// This must come after last app.use()
//var server = require('http').Server(app.callback()),
//  io = require('socket.io')(server);


// Start the server
app.listen(1337, function () {
  console.log("Server listening on %s", this._connectionKey);
  new SocketHandler(app.webSockets);
});
