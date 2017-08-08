const logger = require("./util/logger")();
logger.setLevel(logger.INFO);

// const inazuma = require("./bot/inazuma");
const cq = require("./smi/cqbot/cq-adapter");
const plug = require("./capa/kancolle/exercise-reminder");
cq.init("bus", function (){
  plug(cq);
  logger.info("Plug-in starts");
  // cq.sendGroupMsg(595664719, "電醬的第一次任務大成功[CQ:face,id=21][CQ:face,id=21][CQ:face,id=21]");
});
