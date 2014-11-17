var tdm_server_socket, client;


$(function () {
  var socket = io('/client');
  socket.on('server_hello', server_hello_handler);
  socket.on('message', message_handler);
  socket.on('redirect', redirect_handler);
  socket.on('disconnect', disconnect_handler);
});

function server_hello_handler(data) {
  tdm_server_socket = this;
  tdm_server_socket.emit('client_hello', {});
  $('#status').addClass('connected').text(data.server_name + '#' + data.client_name);
}

function disconnect_handler() {
  $('#status').removeClass('connected').text('offline');
}

function message_handler(data) {
  console.log(data);
  var message_area = $('.log');
  var current_text = message_area.text();
  message_area.html(data.msg + '\n' + current_text);
  message_area.scrollTop(message_area[0].scrollHeight - message_area.height());
}

function redirect_handler(data) {
  location.replace(data.url + (data.url.indexOf('?') ? '&' : '?') + 'return_url=' +
    encodeURIComponent(location.href));
}
