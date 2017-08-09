const path = require("path");
function _require(js){
  if(js.startsWith("./")){
    js = path.join("..", "..", js.substr(2));
  }
  return require(js);
}

const CSON = require("cson");
const WebSocketClient = require('websocket').client;

const plugin_for = _require("./smi/lib/plugin-valid");
const logger = _require("./util/logger")("cq-bot");
logger.setLevel(logger.INFO);

const INFO = readCsonFile(path.join(__dirname, "info.cson"));
const CONFIG = readCsonFile(path.join(__dirname, "config.cson"));

let connection = null;
let validators = null;

function readCsonFile(configFile){
  try{
    fs.accessSync(configFile, fs.R_OK|fs.W_OK);
    return CSON.parseCSONFile(configFile);
    logger.info(`SMI Configs read from ${configFile}`);
  }
  catch(e){
    logger.warn(`Fail to read SMI configs from ${configFile}`);
    return undefined;
  }
}

function initValidator(){
  if(CONFIG){
    for(let group of CONFIG.target){
      for(let patt of group.subsc){
        plugin_for(`${INFO.id}.${group.id}`).setPattern(patt);
      }
    }
  }
}

function init(cb){
  initValidator();

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
            global.bot.handle("message.input", JSON.parse(message.utf8Data));
        }
    });

    /**
     * bundle{
     *   src: {
     *     id: plugin_id,
     *     mod: mod_name
     *   },
     *   msg: <string>,
     * }
     */
    global.bot.on("message.output", function(bundle){
      for(let group of CONFIG.target){
        if(plugin_for(`${INFO.id}.${group.id}`).isValid(bundle.src.id, bundle.src.mod)){
          logger.debug(`A message is sent to group with id=${group.id}`);
          // sendGroupMsg(group.id, bundle.msg);
        }
      }
    });

    cb();
  });

  cq.connect("ws://localhost:25303");

  logger.info("CQ-bot is initialized");
}

function parseSubscSyntax(syntax){
  if(typeof syntax !== "string") return undefined;

  if(syntax.indexOf("@")){

  }
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
