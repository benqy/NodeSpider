var dao = require('../app/modules/dao/movie.js'),
    urlModule = require('url'),
    logDao = require('../app/modules/dao/log.js'),
    regex = require('../app/helpers/regex.js'),
    _ = require('../app/helpers/underscore.js');

//替换文本标签为:nsImg,防止自动下载图片
var replaceImg = function(text){
  text = text.replace(/<img/g,'<nsImg');
  return text;
};
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
  this.agent = new HttpAgent(config.pages || []);
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
      //初始数据加载完成后运行抓取器
    }.bind(this));
    
    //跳过已访问过的地址
    logDao.history(this.target,'visited', function(visited) {
			this.agent._visited=visited;
			logDao.history(this.target,'unvisited', function(unvisited) {
				if(unvisited.length) {
					//移除已访问的链接
					unvisited = _.uniq(unvisited);
					unvisited= _.difference(unvisited,this.agent._visited);
					this.agent._unvisited = unvisited;
				}
        this.agent.emit('spiderStart');
        this.agent.start();
			}.bind(this));
		}.bind(this));
    
	},
  next:function(err,res) {
    var me = this,agent = this.agent,html,urls,movieInfo;
    if(res.error){
      agent.emit('error',res);
      setTimeout(function(){
        agent.next();      
      },3000);
      return;
    }
    html = $(replaceImg(res.html));
    agent.emit('visited',res.url,this.target);
    urls = this.urlGrab.grab(html,this.target,this.config.filters,this.config.accapts);
    urls = urls.map(function(url){
      return urlModule.resolve('http://' + me.target,url);
    });
    urls =_.uniq(urls);
    //去重后将url添加到待抓取列表
    var toAddUrls = _.difference(urls,agent._visited);
		toAddUrls = _.difference(toAddUrls,agent._unvisited);
		agent.addUrl(toAddUrls);
    agent.emit('addUrl',toAddUrls,agent._unvisited.length,this.target);
    //采集电影信息
    movieInfo = this.dataGrab.grapMovie(html,$,res.url);
    if(movieInfo && movieInfo.id){
      this.save(movieInfo);
      agent.emit('useful',this.target,res.url);
    }
    else{
      agent.emit('unuseful',res.url);
    }
    setTimeout(function(){
			agent.next();
    },1000);
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
    if(!_id) {
      dao.saveOrUpdate(data,_id, function() {
        this.movies.push({
          id:data.key,
          _id:data._id
        });
        _id = data._id;
        this.agent.emit('saved',_id);
      }.bind(this));
    }
    else{
      this.agent.emit('update',_id);
    }
	}
};

var config = {
  targets:['www.2tu.cc'],//抓取站点
  pages:[],
  accapts:[
    '.html'
  ],
  filters:[
  ],//无效链接过滤关键字
  log:true,//是否使用日记
  norepeat:false//每次运行是否重新抓取已访问过的网站（true即为断点续抓，一般只有调试才设为false）
};
/*var init2tuUrls = function(){
  var urls =[];
  for(var i = 1;i <= 20129;i++){
    urls.push({ url : 'http://www.2tu.cc/Html/GP'+i+'.html' });
  }
  logDao.save('www.2tu.cc.unvisited',urls,function(){});
};
init2tuUrls();*/
//20129
new Spider(config);