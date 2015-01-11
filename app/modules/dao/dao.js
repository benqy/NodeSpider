module.exports = function(target){
	var mongo = require('mongoskin'),
	db = mongo.db('mongo://127.0.0.1:27017/bi?auto_reconnect');
	return {
		save:function(data,fn){
			db.collection(target).insert(data,null,fn);
			db.close();
		},
		saveOrUpdate:function(data,_id,fn){
			if(!_id){
				data.time = (new Date()).getTime();
				db.collection(target).insert(data,null,fn);
			}
			else{
				//db.collection(target).updateById(_id,data,fn);
			}
			db.close();
		},
		movies:function(fn){
			db.collection(target).find({},{'key':1}).toArray(function(err,data){
				if(err) throw err;
				fn(data);
				db.close();
			});
		}
	}
}