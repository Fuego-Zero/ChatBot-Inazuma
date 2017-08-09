const logger = require("./logger")("config");

const path = require("path");
const CSON = require("cson");
const fs = require("fs-extra");
const _ = require("lodash");
const EventEmitter = require("events");
const configFile = process.cwd();

class SimpleConfig extends EventEmitter{
  constructor(){
    super();

    this.configData = {};
    this.reload();
  }

  has(key){
    return _.has(this.configData, key);
  }

  default(key, default_value){
    if(!this.has(key)){
      this.set(key, default_value);
    }
    return this;
  }

  get(key, default_value){
    if(default_value !== undefined){
      this.default(key, default_value);
    }

    return _.get(this.configData, key);
  }

  set(key, value){
    if(_.get(this.configData, key)===value){
      return;
    }
    _.set(this.configData, key, value);
    this.emit("config.set", key, value);
    try{
      var cfg = CSON.stringify(this.configData, null, 2);
      fs.writeFileSync(configFile, cfg);
    }
    catch(e){
      logger.error(`Fail to write to config at ${configFile}`);
    }

    return this;
  }

  reload(){
    this.emit("config.reload.pre", this.configData);

    fs.ensureFileSync(configFile);
    try{
      fs.accessSync(configFile, fs.R_OK|fs.W_OK);
      this.configData = CSON.parseCSONFile(configFile);
      logger.info(`Configs read from ${configFile}`);
    }
    catch(e){
      logger.warn(`Fail to read configs from ${configFile}`);
    }

    this.emit("config.reload.post", this.configData);

    return this;
  }
}

const cfg = new SimpleConfig();
cfg.setMaxListeners(100);

module.exports = cfg;
