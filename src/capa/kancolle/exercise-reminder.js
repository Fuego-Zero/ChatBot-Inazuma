let cq = null, loop = null;

function checkExercTime(){
  let current = new Date();
  let target = new Date(`${current.getFullYear()}.${current.getMonth() + 1}.${current.getDate()} 06:10:00`);

  if(current >= target){
    cq.sendGroupMsg(460443703, "演習!!!!!!!!!!!");
    setTimeout(function(){
      cq.sendGroupMsg(460443703, "呼哇哇哇.... 電醬的第一次任務大成功 [CQ:face,id=21]");
    }, 1000);
    clearInterval(loop);
  }
}

module.exports = function(bot){
  cq = bot;
  loop = setInterval(checkExercTime, 300000);
};
