var dao = require('../app/modules/dao/movie.js'),
    urlModule = require('url'),
    _ = require('../app/helpers/underscore.js');

//母蜘蛛
function Spider(config) {
	var me = this;
	//抓取逻辑文件名（尽量使用站点域名）
  this.config = config;
	this.target =  config.targets.shift();
	//链接采集器
  this.urlGrab = require('../app/modules/UrlGrab/'+this.target +'.js');
  //因为node-webkit里使用require加载的模块global不是window，所以要手动传入window.$引用
  this.urlGrab.init($);
  //数据采集器
  this.dataGrab = require('../app/modules/DataGrab/'+this.target +'.js');
  
	//页面内容抓取器，配置的文件名即为站点名。
  this.agent = new HttpAgent(['http://www.2tu.cc/Html/GP19334.html']);
  //抓下一个url
  this.agent.addListener('next', this.next.bind(this));
  //一个站点抓取完毕
  this.agent.addListener('stop', function(){
    this.agent.emit('spiderEnd');
  }.bind(this));
  this.start();
}

Spider.prototype = {
	start: function() {
    dao.movies( function(data) {
      this.movies = data;
      //初始数据加载完成后运行抓取器
      if(this.config.log) {
        require('../app/modules/log/log.js')(this);
      }
      this.agent.emit('spiderStart');
      this.agent.start();
      //_self.savedGoods = data;
      //初始数据加载完成后运行抓取器
    }.bind(this));
	},
  next:function(err,res) {
    var me = this,agent,html,urls,movieInfo;
    agent = this.agent
    if(res.error){
      agent.emit('error',res);
      agent.next();
      return;
    }
    html = $(res.html);
    agent.emit('loadComplate',res.url);
    urls = this.urlGrab.grab(html,this.target,this.config.filters,this.config.accapts);
    urls =_.uniq(urls);
    //去重后将url添加到待抓取列表
    var toAddUrls = _.difference(urls,agent._visited);
		toAddUrls = _.difference(toAddUrls,agent._unvisited);
    toAddUrls = toAddUrls.map(function(url){
      return urlModule.resolve('http://' + me.target,url);
    });
		agent.addUrl(toAddUrls);
    agent.emit('addUrl',toAddUrls,agent._unvisited.length,this.target);
    movieInfo = this.dataGrab.grapMovie(html,$,res.url);
    if(movieInfo && movieInfo.id){
      this.save(movieInfo);
      agent.emit('useful',this.target,res.url);
    }
    else{
      agent.emit('unuseful',res.url);
    }
		agent.next();
		/*
		if(_good) {
			_good.website = uri;
			this.collection= _good.collection;
			_self.save(_good);
			_good = null;
			agent.emit('useful',_self.target,uri);
		} else {
			//agent.emit('unuseful',agent.current.uri);
		}
		agent.emit('visited',uri,_self.target);
		agent.next();*/
	},
	save: function(data) {
		var me = this;
		//判断数据库中是否已有该商品
		var savedLen = this.movies.length;
		var _id;
		while(savedLen--) {
			if(this.movies[savedLen].id && this.movies[savedLen].id == data.id) {
				_id = this.movies[savedLen]._id;
				break;
			}
		}
		dao.saveOrUpdate(data,_id, function() {
      this.movies.push({
        id:data.key,
        _id:data._id
      });
      _id = data._id;
      this.agent.emit('saved',_id);
			//抓取图片TODO图片的存储逻辑有点混乱？
			/*grabImage.grabImage(data,_id, function(imgFullName) {
				_self.agent.emit('savedImage',imgFullName);
			});*/
		}.bind(this));
	}
};

var config = {
  targets:['www.2tu.cc'],//抓取站点
  accapts:[
    '.html'
  ],
  filters:[
  ],//无效链接过滤关键字
  
  log:true,//是否使用日记
  norepeat:false//每次运行是否重新抓取已访问过的网站（true即为断点续抓，一般只有调试才设为false）
};
new Spider(config);