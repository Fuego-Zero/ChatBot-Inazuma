const ipc = require("node-ipc");
const path = require("path");

const logger = require("../util/logger");
const initEvents = require("./eventhandler");

const SOCK_PATH = path.join(process.cwd(), "tmp");

let DEFAULT_CONFIG = {
  name: "Chatbot_A",
  gender: "boy",
  owner: {
      name: "sir"
  }
};

let BOT_INSTANCE = null;
module.exports.ChatBot = class ChatBot{
  constructor(new_config){
    this.say(`Don't hurry. I'm waking up.`);

    _.assign(this, _.assign(DEFAULT_CONFIG, new_config));

    ipc.config.retry = 500;
    ipc.serve(
      path.join(SOCK_PATH, `${name}.sensory`),
      function (){
        initEvents(ipc.server);
        this.say("Good morning, I'm ready!");
      }
    );
    ipc.server.start();
  }

  say(msg, ...sub){
    console.log(msg, ...sub);
  }
}

module.exports.createBot = function(name){
  return (BOT_INSTANCE = new ChatBot(name));
}
