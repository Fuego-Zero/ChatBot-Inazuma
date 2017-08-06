const propProxy = require("./property-proxy");

const ALL = 0;
const DEBUG = 10;
const INFO = 20;
const WARN = 30;
const ERROR = 40;
const FATAL = 50;

class Logger{
  constructor(lvl = ERROR){
    // CONST list
    this.ALL = ALL;
    this.DEBUG = DEBUG;
    this.INFO = INFO;
    this.WARN = WARN;
    this.ERROR = ERROR;
    this.FATAL = FATAL;

    // member
    this.enabled = true;
    this.level = lvl;
  }

  debug(template, ...substitues){
    if(this.enabled && this.level <= this.DEBUG) console.log(`[Debug] ${template}`, ...substitues);
  }

  info(template, ...substitues){
    if(this.enabled && this.level <= this.INFO) console.log(`[Info] ${template}`, ...substitues);
  }

  warn(template, ...substitues){
    if(this.enabled && this.level <= this.WARN) console.warn(`[Warn] ${template}`, ...substitues);
  }

  error(template, ...substitues){
    if(this.enabled && this.level <= this.ERROR) console.error(`[Error] ${template}`, ...substitues);
  }

  fatal(template, ...substitues){
    if(this.enabled && this.level <= this.FATAL) console.error(`[fatal] ${template}`, ...substitues);
  }

  trace(template, ...substitues){
    if(this.enabled) console.trace(template, ...substitues);
  }

  dir(obj, options={colors: true}){
    if(this.enabled) console.dir(obj, options);
  }

  setLevel(lvl = ERROR){
    this.level = lvl;
  }

  off(){
    this.enabled = false;
  }

  on(){
    this.enabled = true;
  }
}

module.exports = new Proxy(new Logger(), propProxy);
