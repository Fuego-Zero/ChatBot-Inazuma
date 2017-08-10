const ch = require("../../../lang/chinese");
const jp = require("jp-conversion");
const _ = require("lodash");

const SHIP_INFO = require("./poi-stat.ship-info");
const SHIP_EXDATA = require("./poi-stat.constant");

function getPoiIDByName(name){
  name = ch.t2s(name);
  let idx = _.findIndex(SHIP_INFO, function(ship){
      return ship.chinese_name == name;
    });

  if(idx >= 0){
    return SHIP_INFO[idx].id;
  }
  return -1;
}

function getPoiIDByYomiHira(hiragana){
  let idx = _.findIndex(SHIP_INFO, function(ship){
      return ship.yomi == hiragana;
    });

  if(idx >= 0){
    return SHIP_INFO[idx].id;
  }
  return -1;
}

function getPoiIDByYomiRomaji(romaji){
  let converted = jp.convert(romaji);
  if(converted.hiragana){
    let idx = _.findIndex(SHIP_INFO, function(ship){
        return ship.yomi == converted.hiragana;
      });

    if(idx >= 0){
      return SHIP_INFO[idx].id;
    }
  }
  return -1;
}

function getPoiIDByNameExdata(name){
  name = ch.t2s(name);
  for(let ship_name of _.keys(SHIP_EXDATA.shipData)){
    if(_.indexOf(SHIP_EXDATA.shipData[ship_name].nameForSearch.split(","), name) >= 0){
      return getPoiIDByName(SHIP_EXDATA.shipData[ship_name].chineseName);
    }
  }

  return -1;
}

module.exports = {
  getPoiIDByName,
  getPoiIDByYomiHira,
  getPoiIDByYomiRomaji,
  getPoiIDByNameExdata
};
