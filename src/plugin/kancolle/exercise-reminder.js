const CSON = require("cson");

const INFO = CSON.parseCSONFile(path.join(__dirname, "info.cson"));
const SMI = "cq-bot";
const MOD = "adapter";

let cq = null, loop = null;

function checkExercTime(){
  // let current = new Date();
  // let target = new Date(`${current.getFullYear()}.${current.getMonth() + 1}.${current.getDate()} 13:00:00`);
  //
  // if(current >= target){
		global.bot.handle("message.output", {
      src: {
        id: INFO.id,
        mod: path.basename(__filename, ".js")
      }
			msg: "演習!!!!!!!!!!!!!!"
		});
    clearInterval(loop);
  // }
}

function run(){
  loop = setInterval(checkExercTime, 1000);
}

module.exports = {
  run
};
