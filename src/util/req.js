function getJSON (url, cb){
  request({ url: url, json: true }, function (err, res, body) {
    if(err) return cb(err);
    if(res.statusCode != 200) return;
    cb(undefined, body);
  });
}

module.exports = {
  getJSON
};
