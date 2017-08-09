const {EventEmitter} = require("events");
const fs = require("fs-extra");
const _ = require("lodash");
const path = require("path");
const CSON = require("cson");

const ifs = require("../util/fs");
const logger = require("../util/logger")("plugin-handler");
const const_proxy = require("../util/const-proxy");

const plugin_dir = path.join(__dirname, "..", "plugin");


class PluginHandler extends EventEmitter{
  constructor(){
    super();

    this.PLUGIN_LIST = {};
    this.loadFromPluginDir();
  }

  // proxy the module functions for plug-ins
  exec(plugin_id, mod){
    return setImmediate(this.PLUGIN_LIST[plugin_id][mod]);
  }

  execAll(){
    logger.info("Execute all plugins");
    for(let plugin of _.keys(this.PLUGIN_LIST)){
      for(let mod of _.keys(this.PLUGIN_LIST[plugin])){
        this.exec(plugin, mod);
        logger.debug(`Module '${mod}' from '${plugin}' starts`);
      }
    }
  }

  register(plugin_id, mod = "", api = {}){
    if(plugin_id === undefined){
      logger.error("No plugin_id is provided to be registered");
      return;
    }
    if(api.run === undefined){
      logger.error("A plugin should export an object containing a run function");
      return;
    }

    _.set(this.PLUGIN_LIST, [plugin_id, mod], api.run);
    logger.info(`A module '${mod}' from plugin '${plugin_id}' is registered`);
  }

  loadFromPluginDir(){
    for(let plugin of ifs.getDirList(plugin_dir)){
      let plugin_info = {};
      try{
        let plugin_info_file = path.join(plugin, "info.cson");
        fs.accessSync(plugin_info_file, fs.R_OK|fs.W_OK);
        plugin_info = CSON.parseCSONFile(plugin_info_file);
      }
      catch(e){
        logger.warn(`Fail to read info.cson from ${plugin}`);
        logger.warn(e);
        continue;
      }


      for(let mod of plugin_info.module){
        let rel_path = path.relative(__dirname, path.resolve(plugin, mod));
        this.register(plugin_info.id, mod, require(rel_path));
      }
    }
  }
}

const handler = new Proxy(new PluginHandler(), const_proxy);
handler.setMaxListeners(100);

module.exports = handler;
