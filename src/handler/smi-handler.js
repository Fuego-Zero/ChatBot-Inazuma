const fs = require("fs-extra");
const {EventEmitter} = require("events");
const path = require("path");
const _ = require("lodash");
const CSON = require("cson");

const const_proxy = require("../util/const-proxy");
const ifs = require("../util/fs");
const logger = require("../util/logger")("smi-handler");

const smi_dir = path.join(__dirname, "..", "smi");

class SmiHandler extends EventEmitter{
  constructor(){
    super();

    this.SMI_LIST = {};
    this.SMI_STAT = {};
    this.loadFromSmiDir();
  }

  isReady(smi_id, mod){
    if(!smi_id && mod){
      return;
    }

    if(smi_id){
      if(!mod){
        for(mod of _.keys(this.SMI_STAT[smi_id])){
          if(!this.SMI_STAT[smi_id][mod]){
            return false;
          }
        }
        return true;
      }
      return this.SMI_STAT[smi_id][mod];
    }

    for(smi_id of _.keys(this.SMI_STAT)){
      for(mod of _.keys(this.SMI_STAT[smi_id])){
        if(!this.SMI_STAT[smi_id][mod]){
          return false;
        }
      }
    }
    return true;
  }


  initSmi(smi_id, mod){
    let hander = this;
    return setImmediate(function(){
      hander.SMI_LIST[smi_id][mod].init(function(){
        hander.SMI_STAT[smi_id][mod] = true;
      });
    });
  }

  initAll(){
    for(let smi of _.keys(this.SMI_LIST)){
      for(let mod of _.keys(this.SMI_LIST[smi])){
        this.initSmi(smi, mod);
      }
    }
  }

  has(smi_id, mod, func){
    return _.has(this.SMI_LIST, [smi_id, mod, func]);
  }

  // proxy the module functions for plug-ins
  call(smi_id, mod, func, ...args){
    return this.SMI_LIST[smi_id][mod][func](...args);
  }

  getModule(smi_id, mod){
    return (this.SMI_STAT[smi_id][mod])? this.SMI_LIST[smi_id][mod]: undefined;
  }

  register(smi_id, mod = "", api = {}){
    if(smi_id===undefined){
      logger.error("No smi_id is provided to be registered");
      return;
    }
    _.set(this.SMI_LIST, [smi_id, mod], api);
    _.set(this.SMI_STAT, [smi_id, mod], false);
    logger.info(`A module '${mod}' from SMI '${smi_id}' is registered`);
  }

  loadFromSmiDir(){
    for(let smi of ifs.getDirList(smi_dir)){
      if(path.basename(smi) != "lib"){
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

        for(let mod of smi_info.module){
          let rel_path = path.relative(__dirname, path.resolve(smi, mod));
          this.register(smi_info.id, mod, require(rel_path));
        }
      }

    }
  }
}

const handler = new Proxy(new SmiHandler(), const_proxy);
handler.setMaxListeners(100);

module.exports = handler;
