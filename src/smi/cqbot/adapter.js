const path = require("path");
function _require(js){
  if(js.startsWith("./")){
    js = path.join("..", "..", js.substr(2));
  }
  return require(js);
}

const WebSocketClient = require('websocket').client;

const logger = _require("./util/logger")("cq-bot");
logger.setLevel(logger.INFO);
const bus = _require("./init/event-buses").evbus_smi;

let connection = null;

function init(cb){
  let cq = new WebSocketClient();

  cq.on('connect', function(conn) {
    logger.info('CQ is connected');

    connection = conn;

    conn.on('error', function(error) {
        logger.error("CQ Connection Error: " + error.toString());
    });

    conn.on('close', function() {
        logger.info('CQ Connection is closed');
    });

    conn.on('message', function(message) {
        if (message.type === 'utf8') {
            bus.emit("message.input", JSON.parse(message.utf8Data));
        }
    });

    bus.on("message.output");

    cb();
  });

  cq.connect("ws://localhost:25303");

  logger.info("CQ-bot is initialized");
}

function sendGroupMsg(group_id, msg){
  sendRaw({
    act: 101,
    groupid: group_id,
    msg: msg
  });
}

function sendRaw(pkt){
  if(isConnected()){
    connection.sendUTF(JSON.stringify(pkt));
  }
  else{
    logger.error("Error occurs due to no connection available. Do you forget to call init()?");
  }
}

function isConnected(){
  return Boolean(connection);
}

module.exports = {
  init,
  isConnected,
  sendGroupMsg
};
