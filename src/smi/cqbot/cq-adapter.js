const logger = require("../../util/logger")("cq-bot");
logger.setLevel(logger.INFO);
const WebSocketClient = require('websocket').client;

let connection = null;

function init(event_bus, cb){
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
            logger.debug(message.utf8Data);
        }
    });

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
