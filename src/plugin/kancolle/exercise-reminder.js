let cq;
let loop = null;

function checkExercTime(){
	console.log("checking");
  let current = new Date();
  let target = new Date(`${current.getFullYear()}.${current.getMonth() + 1}.${current.getDate()} 01:30:00`);

  if(current >= target){
    cq.sendGroupMsg(460443703, "演習!!!!!!!!!!!");
    setTimeout(function(){
      cq.sendGroupMsg(460443703, "[CQ:face,id=21]");
    }, 1000);
    clearInterval(loop);
  }
}

function run(){
  cq = global.bot.getApi("cq-bot", "adapter");
  loop = setInterval(checkExercTime, 1000);
}

module.exports = {
  run
};
