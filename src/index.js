const config = require("./init/default-configs");
const logger = require("./util/logger")();

if(config.get("global.debug_mode_enabled")){
  logger.setLevel(logger.DEBUG);
}
else{
  logger.setLevel(logger.ERROR);
}

global.app_name = "chatbot-inazuma";
global.bot = require("./bot/inazuma");
bot.run();

// config.get()
// logger.setLevel(logger.ERROR);
//
// console.log(process.env.NODE_ENV);
// const inazuma = require("./bot/chatbot");
// const cq = require("./smi/cqbot/cq-adapter");
// const plug = require("./capa/kancolle/exercise-reminder");
// cq.init("bus", function (){
//   plug(cq);
//   logger.info("Plug-in starts");
//   // cq.sendGroupMsg(595664719, "電醬的第一次任務大成功[CQ:face,id=21][CQ:face,id=21][CQ:face,id=21]");
// });
