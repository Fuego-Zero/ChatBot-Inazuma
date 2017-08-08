const {EventEmitter} = require("events");

const EVENT_BUS = new EventEmitter();

module.exports = function(ipc_socket){
  ipc_socket.on("message.in", onHearing);
  ipc_socket.on("message.out", onSpeaking);
}

onHearing(data, smi){
  this.emit("hearing", data);
}

onSpeaking(data, smi){
  this.emit("speaking", data);
}
