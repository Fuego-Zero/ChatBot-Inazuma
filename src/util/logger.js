const constProxy = require("./const-proxy");

const ALL = 0;
const DEBUG = 10;
const INFO = 20;
const WARN = 30;
const ERROR = 40;
const FATAL = 50;

let logger_map = {};

class Logger{
  constructor(name="root"){
    // CONST list
    this.ALL = ALL;
    this.DEBUG = DEBUG;
    this.INFO = INFO;
    this.WARN = WARN;
    this.ERROR = ERROR;
    this.FATAL = FATAL;

    // member
    this.enabled = true;
    this.name = name;
    this.level = ERROR;

    // init log level
    for(let last_ns = -1, parent_name = ""; (last_ns = name.lastIndexOf(".")) >= 0; name = parent_name){
      parent_name = name.substr(0, last_ns);
      if(logger_map[parent_name]){
        this.level = logger_map[parent_name].level;
        break;
      }
    }
  }

  debug(template, ...substitues){
    if(this.enabled && this.level <= this.DEBUG) console.log(`[${new Date().toLocaleString()}] [${this.name}] [Debug] ${template}`, ...substitues);
  }

  info(template, ...substitues){
    if(this.enabled && this.level <= this.INFO) console.log(`[${new Date().toLocaleString()}] [${this.name}] [Info] ${template}`, ...substitues);
  }

  warn(template, ...substitues){
    if(this.enabled && this.level <= this.WARN) console.warn(`[${new Date().toLocaleString()}] [${this.name}] [Warn] ${template}`, ...substitues);
  }

  error(template, ...substitues){
    if(this.enabled && this.level <= this.ERROR) console.error(`[${new Date().toLocaleString()}] [${this.name}] [Error] ${template}`, ...substitues);
  }

  fatal(template, ...substitues){
    if(this.enabled && this.level <= this.FATAL) console.error(`[${new Date().toLocaleString()}] [${this.name}] [fatal] ${template}`, ...substitues);
  }

  trace(template, ...substitues){
    if(this.enabled) console.trace(template, ...substitues);
  }

  dir(obj, options={colors: true}){
    if(this.enabled) console.dir(obj, options);
  }

  setLevel(lvl = this.ERROR){
    this.level = lvl;

    // find all child loggers
    for(let logger_key in logger_map){
      if(logger_key.startsWith(this.name) && logger_map[logger_key].level < lvl){
        logger_map[logger_key].level = lvl;
      }
    }
  }

  off(){
    this.enabled = false;
  }

  on(){
    this.enabled = true;
  }

  static getLogger(name){
    name = (!name)? "root": (name.startsWith("root"))? name: `root.${name}`;
    return (logger_map[name])? logger_map[name]: (logger_map[name] = new Proxy(new Logger(name), constProxy));
  }
}

// init root logger
logger_map.root = Logger.getLogger("root");
module.exports = Logger.getLogger;
