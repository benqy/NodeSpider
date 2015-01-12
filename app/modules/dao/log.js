var mongo = require('mongoskin'),
    db = mongo.db('mongodb://127.0.0.1:27017/spiderlog?auto_reconnect');
db.bind('spiderlog');
module.exports = {
  save:function(collection,data,fn){
    db.collection(collection).insert(data,null,fn);
    db.close();
  },
  history:function(collection,type,fn){
    db.collection(collection+ '.' +type).find({}).toArray(function(err,data){
      db.close();
      if(err) throw err;
      var result = [];
      var i = data.length;
      while(i--){
        result.push(data[i].url);
      }
      fn(result);	
    });
  }
};