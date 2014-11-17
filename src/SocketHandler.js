var _ = require('lodash'),
  debug = require('debug')('socket'),
  useragent = require('useragent');

function Client(socket) {
  var userAgent;

  this.socket = socket;
  this.socket.model = this;
  this.control = socket.nsp.name === '/control';

  socket.on('client_hello', _.bind(function (data) {
    data = data || {};

    if (!data.room) {
      data.room = 'public';
    }

    if (data.userAgent) {
      userAgent = data.userAgent
    }

    socket.join(data.room);
    this.room = data.room;
  }, this));

  this.getUserAgent = function () {
    return data.userAgent || socket.handshake.headers['user-agent'];
  };

  this.getName = function () {
    return socket.id;
  }
}

var SocketHandler = function (io) {
  var version = '0.2';
  var clientNamespace = io.of('/client'),
    controlNamespace = io.of('/control');

  function disconnectHandler() {
    var socket = this;

    sendClientList(socket.model.room);
  }

// Control clients ******************************************
  function control_client_hello_handler(data) {
//    var socket = this;
//    var client_name = getClientName(socket);
//    controlClients[client_name] = new Client(socket, data.user_agent, true);
//    socket.tdm_control_client = true;
//    send_client_list(socket);
//    send_message(socket, 'TDM Version: ' + version);
//    broadcast_message('control client connected: ' + client_name);
//    socket.emit('redirect_url', {url: 'about:blank'});
  }


  function sendClientList(room, socket) {
    if (!clientNamespace.adapter.rooms[room]) {
      return;
    }

    var clients = _.reduce(clientNamespace.sockets, function (result, socket) {
      if (clientNamespace.adapter.rooms[room][socket.id]) {
        result[socket.id] = socket.model.getUserAgent();
      }
    }, {});

    (socket ? socket : controlNamespace.to(room)).emit('client_list', clients);
  }


// **********************************************************
  function go_handler(data) {
    var client_list = data.client_list;
    var redirect_url = data.url;

    if (client_list.length == 0) {
      broadcast_message('go: <empty client list>');
      return;
    }

    if (redirect_url == '') {
      broadcast_message('go: <missing url>');
      return;
    }

    broadcast_message('go client_list: ' + client_list);
    broadcast_message('go url: ' + redirect_url);

    for (var i = 0; i < client_list.length; i++) {
      clients[client_list[i]].socket.emit('redirect', {url: redirect_url});
    }
  }

  clientNamespace.on('connection', function (socket) {
    var client = new Client(socket);

    socket.on('disconnect', disconnectHandler);
    socket.emit('server_hello', {
      server_name: 'TDM',
      client_name: client.getName()
    });
  });

  controlNamespace.on('connection', function (socket) {
    socket.on('control_client_hello', control_client_hello_handler);
    socket.on('go', go_handler);
    socket.emit('server_hello', {
      server_name: 'TDM',
      client_name: client.getName()
    });
  });
};


module.exports = SocketHandler;