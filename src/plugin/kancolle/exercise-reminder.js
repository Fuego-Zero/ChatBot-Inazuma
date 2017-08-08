const SMI = "cq-bot";
const MOD = "adapter";

let cq = null, loop = null;

function checkExercTime(){
  let current = new Date();
  let target = new Date(`${current.getFullYear()}.${current.getMonth() + 1}.${current.getDate()} 01:30:00`);

  if(current >= target){
    cq.sendGroupMsg(595664719, "演習!!!!!!!!!!!");
    setTimeout(function(){
      cq.sendGroupMsg(595664719, "[CQ:face,id=21]");
    }, 1000);
    clearInterval(loop);
  }
}

function run(){
  cq = global.bot.getSmiApi(SMI, MOD);
  loop = setInterval(checkExercTime, 1000);
}

module.exports = {
  run
};
