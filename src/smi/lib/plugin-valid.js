const CSON = require("cson");
const path = require("path");
const fs = require("fs-extra");
const _ = require("lodash");

const logger = require("../../util/logger")("plugin-valid");

const VALIDATORS = {};
const SMI_DIR = path.join("..");

class PluginValidator{
  constructor(id){
    this.id = id;
    this.patterns = [];
    this.cachedPlugins = {};

    this.VALIDATOR_IDENTIFIER = `[validator='${this.id}']`;
  }

  setPattern(patt){
    this.patterns.push(patt);
  }

  cacheAsValid(exact_mod_id){
    logger.debug(`${this.VALIDATOR_IDENTIFIER} Cache ${exact_mod_id} as valid plugin`);
    return this.cachedPlugins[exact_mod_id] = true;
  }

  cacheAsInvalid(exact_mod_id){
    logger.debug(`${this.VALIDATOR_IDENTIFIER} Validation for ${exact_mod_id} fails`);
    return this.cachedPlugins[exact_mod_id] = false;
  }

// TODO testing is needed!!!
// [tested] exactly matched e.g. "exercise-reminder@kancolle" (valid plugin whose id=kancolle and module=exercise-reminder)
// [tested] wildcard module name and exactly matched id e.g. "*@kancolle" (valid plugin whose id=kancolle)
// [tested] exactly matched id e.g. "kancolle" (valid plugin whose id=kancolle)
// [tested] empty pattern i.e. "" (invalid all)
// [tested] wildcard pattern i.e. "*" (valid  all)
  isValid(plugin_id, mod){
    let exact_id = `${mod}@${plugin_id}`;
    if(_.has(this.cachedPlugins, [exact_id])){
      logger.debug(`${this.VALIDATOR_IDENTIFIER} Cache hit by ${exact_id}, validation result=${this.cachedPlugins[exact_id]}`);
      return this.cachedPlugins[exact_id];
    }

    for(let patt of this.patterns){
      if(patt == "*"){
        return this.cacheAsValid(exact_id);
      }

      if(patt.indexOf("@") >= 0){
        let plugin_pair = patt.split("@");
        let mod_patt = plugin_pair[0].trim();
        let id_patt = plugin_pair[1].trim();
        if(id_patt){
          if(new RegExp('^' + id_patt.replace("*", ".*") + '$').test(plugin_id)){
            if(new RegExp('^' + mod_patt.replace("*", ".*") + '$').test(mod)){
              return this.cacheAsValid(exact_id);
            }
            logger.debug(`${this.VALIDATOR_IDENTIFIER} Module named '${mod}' is not matched with the configured pattern '${mod_patt}'`);
          }
        }

        logger.debug(`${this.VALIDATOR_IDENTIFIER} Plugin id '${plugin_id}' is not matched with the configured pattern '${id_patt}'`);
      }
      else{
        if(new RegExp('^' + patt.replace("*", ".*") + '$').test(plugin_id)){
          return this.cacheAsValid(exact_id);
        }
      }
    }

    return this.cacheAsInvalid(exact_id);
  }

  static getValidator(vid){
    return (VALIDATORS[vid])? VALIDATORS[vid]: (VALIDATORS[vid] = new PluginValidator(vid));
  }
}

module.exports = PluginValidator.getValidator;
