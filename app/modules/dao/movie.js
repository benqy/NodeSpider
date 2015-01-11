var mongo = require('mongoskin'),
    db = mongo.db('mongodb://127.0.0.1:27017/movies?auto_reconnect');
db.bind('movies');
module.exports = {
		save:function(data,fn){
			db.movies.insert(data,null,fn);
			db.close();
		},
		saveOrUpdate:function(data,_id,fn){
			if(!_id){
				data.time = (new Date()).getTime();
				db.collection('movies').insert(data,null,fn);
			}
			else{
				//db.collection(target).updateById(_id,data,fn);
			}
			db.close();
		},
		movies:function(fn){
			db.movies.find({}).toArray(function(err,data){
				if(err) throw err;
				fn(data);
				db.close();
			});
		}
	};