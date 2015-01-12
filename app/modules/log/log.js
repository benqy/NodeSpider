/**
 * TODO 日志存储
 * TODO saved成功事件 参数：data
 */
require('../../helpers/date.format.js');
var dao = require('../../modules/dao/log.js');
var msg= function(text) {
	var _time = new Date();
	console.log('['+_time.format('HH:MM:ss')+']'+text);
};
var savedCount  = 0;
var updateCount = 0;
var visited = 0;
var emptyFn = function(){};
//已存在的商品
var saved = [];
module.exports = function(spider) {
	//抓取开始
	var _spiderStartTime = null;
	spider.agent.addListener('spiderStart', function(agent) {
		_spiderStartTime = new Date();
		msg('============['+spider.target +']开始抓取============');
		msg('--加载已抓取页面：'+spider.agent._visited.length +'个');
		msg('--加载未抓取页面：'+spider.agent._unvisited.length+ '个');
	});
	//结束抓取
	spider.agent.addListener('spiderEnd', function() {
		setTimeout( function() {
			msg('===========[' + spider.target + ']抓取完成,耗时:'+ ((new Date()) - _spiderStartTime)/1000+'秒!==========');
			console.log('---------更新商品'+ updateCount +'个！');
			console.log('---------新增商品'+ savedCount +'个！');
			console.log('=============================================================================');
		},6000);
	});
	spider.agent.addListener('addUrl', function(addUrl,unvisited,target) {
		var i = addUrl.length;
		msg('----本次运行已抓取'+visited+'个页面，添加了' +i+'个待抓取页面,共' + unvisited +'个页面待抓取。' );
		var data = [];
		while(i--) {
			data.push({
				url:addUrl[i]
			});
		}
		dao.save(target+'.unvisited',data,emptyFn);
	});
	//保存成功
	spider.agent.addListener('saved', function(_id) {
		savedCount++;
		msg('----保存商品:['+ _id +']');
	});
	spider.agent.addListener('update', function(_id) {
		updateCount ++;
		msg('----更新商品:['+ _id +']');
	});
	//保存图片
	spider.agent.addListener('savedImage', function(data) {
		msg('----图片保存成功：' + data);
	});
	//开始请求页面
	spider.agent.addListener('beginRequest', function(url) {
		if(url==="") {
			url = "首页";
		}
		msg('--开始加载页面：'+url);
	});
	spider.agent.addListener('useful', function(target,url) {
		var data  = {
			url:url
		};
		dao.save(target + '.useful',data,emptyFn);
	});
	spider.agent.addListener('unuseful', function(url) {
		var data  = {
			url:url
		};
		dao.save('unuseful',data,emptyFn);
	});
	spider.agent.addListener('visited', function(url,target) {
		visited++;
		msg('----页面加载完毕：'+url);
		var data  = {
			url:url
		};
		dao.save(target+'.visited',data,emptyFn);
	});
	spider.agent.addListener('loadComplate', function(url) {
		if(url==="") {
			url = "首页";
		}
	});
};