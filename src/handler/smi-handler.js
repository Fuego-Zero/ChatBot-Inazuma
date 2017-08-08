const fs = require("fs-extra");
const {EventEmitter} = require("events");
const path = require("path");
const _ = require("lodash");

const const_proxy = require("../util/const-proxy");
const ifs = require("../util/fs");
const logger = require("../util/logger")("smi-handler");

const smi_dir = path.join(__dirname, "..", "smi");

class SmiHandler extends EventEmitter{
  constructor(){
    super();

    this.SMI_LIST = {};
    this.loadFromSmiDir();
  }

  has(smi_id, mod, func){
    return _.has(this.SMI_LIST, [smi_id, mod, func]);
  }

  // proxy the module functions for plug-ins
  call(smi_id, mod, func, ...args){
    return this.SMI_LIST[smi_id][mod][func](...args):
  }

  getModule(smi_id, mod){
    return this.SMI_LIST[smi_id][mod];
  }

  register(smi_id, mod = "", api = {}){
    if(smi_id===undefined){
      logger.error("No smi_id is provided to be registered");
      return;
    }
    this.SMI_LIST[smi_id][mod] = api;
    logger.info(`A module '${mod}' from SMI '${smi_id}' is registered`);
  }

  loadFromSmiDir(){
    for(let smi of ifs.getDirList(smi_dir)){
      let smi_info = {};
      try{
        let smi_info_file = path.join(smi, "info.cson");
        fs.accessSync(smi_info_file, fs.R_OK|fs.W_OK);
        smi_info = CSON.parseCSONFile(smi_info_file);
      }
      catch(e){
        logger.warn(`Fail to read info.cson from ${smi}`);
        logger.warn(e);
        continue;
      }

      let mod = "";
      try{
        for(mod of smi_info.module){
          this.register(smi_info.id, mod, require(path.join(smi, mod)));
        }
      }
      catch(e){
        logger.warn(`Fail to load module ${mod} from ${smi}`);
        logger.warn(e);
      }
    }
  }
}

const handler = new Proxy(new SmiHandler(), const_proxy);
handler.setMaxListeners(100);

module.exports = handler;
