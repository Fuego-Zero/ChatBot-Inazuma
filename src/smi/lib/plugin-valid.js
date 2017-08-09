const CSON = require("cson");
const path = require("path");
const fs = require("fs-extra");

const logger = require("./logger")("plugin-valid");

const VALIDATORS = {};
const SMI_DIR = path.join("..");

class PluginValidator{
  constructor(){
    this.patterns = [];
    this.cachedPlugins = {};
  }

  setPattern(patt){
    this.patterns.push(patt);
  }

  isValid(plugin_id, mod){
    let exact_id = `${mod}@${plugin_id}`;
    if(this.cachedPlugins[exact_id]){
      return true;
    }

    for(let patt of this.patterns){
      if(patt == "*"){
        this.cachedPlugins[exact_id] = true;
        return true;
      }

      if(patt.indexOf("@") >= 0){
        let plugin_pair = patt.split("@");
        let mod_patt = plugin_pair[0].trim();
        let id_patt = plugin_pair[1].trim();
        if(id_patt){
          let regexp_id_patt = new RegExp(id_patt.replace("*", ".*"));
          if(plugin_id.match(regexp_id_patt)){
            let regexp_mod_patt = new RegExp(id_patt.replace("*", ".*"));
            if(mod.match(regexp_mod_patt)){
              this.cachedPlugins[exact_id] = true;
              return true;
            }
            logger.debug(`Module named '${mod}' is not matched with the configured pattern '${mod_patt}'`);
          }
        }

        logger.debug(`Plugin id '${plugin_id}' is not matched with the configured pattern '${id_patt}'`);
      }
      else{
        let regexp_id_patt = new RegExp(patt.trim().replace("*", ".*"));
        if(plugin_id.match(regexp_id_patt)){
          this.cachedPlugins[exact_id] = true;
          return true;
        }
      }
    }

    logger.debug(`Validation for ${exact_id} fails`);
    return false;
  }

  static getValidator(vid){
    return (VALIDATORS[vid])? VALIDATORS[vid]: (VALIDATORS[vid] = new PluginValidator());
  }
}

module.exports = PluginValidator.getValidator;
