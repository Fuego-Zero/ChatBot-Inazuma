const _ = require("lodash");
const logger = require("../util/logger")("chatbot");

const const_proxy = require("../util/const-proxy");

let DEFAULT_CONFIG = {
  name: "Chatbot_A",
  gender: "boy",
  owner: {
      name: "sir"
  }
};

class Chatbot{
  constructor(config = {}){
    _.assign(this, DEFAULT_CONFIG);
    _.assign(this, config);

    this.SMI_HANDLER = require("../handler/smi-handler");
    this.PLUGIN_HANDLER = require("../handler/plugin-handler");
  }

  exec(smi_id, mod, func, ...args){
    return this.SMI_HANDLER.call(smi_id, mod, func, ...args);
  }

  run(){
    logger.info(`${this.name} starts running`);

    this.PLUGIN_HANDLER.execAll();
  }

  getApi(smi_id, mod){
    return this.SMI_HANDLER[smi_id][mod];
  }
}

module.exports = new Proxy(new Chatbot(), const_proxy);
