const cq = global.bot.getApi("cq-bot", "adapter");
let loop = null;

function checkExercTime(){
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
  loop = setInterval(checkExercTime, 1000);
}

module.exports = {
  run
};
