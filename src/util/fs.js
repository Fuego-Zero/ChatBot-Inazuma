const fs = require('fs');
const path = require('path');

function isDir(source){
  return fs.lstatSync(source).isDirectory();
}

function getDirList(source){
  return fs.readdirSync(source).map(function(name){
      return path.join(source, name);
    }).filter(isDir);
}

module.exports = {
  isDir,
  getDirList
};
