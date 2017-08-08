const SMI = "cq-bot";
const MOD = "adapter";

let cq = null, loop = null;

function checkExercTime(){
  let current = new Date();
  let target = new Date(`${current.getFullYear()}.${current.getMonth() + 1}.${current.getDate()} 13:00:00`);

  if(current >= target){
		global.bot.handle("message.output", {
			smi: SMI,
			mod: MOD,
			data:{
				type: "group",
				gid: 460443703,
				msg: "演習!!!!!!!!!!!!!!"
			}
		});
    clearInterval(loop);
  }
}

function run(){
  loop = setInterval(checkExercTime, 300000);
}

module.exports = {
  run
};
