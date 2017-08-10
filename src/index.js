global.app_name = "chatbot-inazuma";
global.getLogger = require("./util/logger");

const config = require("./init/default-configs");
const logger = global.getLogger();

if(config.get("global.debug_mode_enabled")){
  logger.setLevel(logger.DEBUG);
}
else{
  logger.setLevel(logger.ERROR);
}

global.bot = require("./bot/inazuma");
bot.run();
