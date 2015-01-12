//通用正则
var regex = require('../../helpers/regex.js');
var moviePageRegex = /^.*GP(\d*)\.html$/;
var $;
module.exports = {
  init:function(jq){
    $ = jq;
  },
	grab: function(html,site,filters,accapts) {
		var _urls = [],website = 'http://'+site +'/';
		//2tu的终极页直接通过规律添加,不用在页面抓取
		/*var links = html.find('a');
		links.each( function(i,n) {
			var href =$(n).attr('href');
			//仅限站内链接（即完整路径里包含站点host的,或者只写路径的
			if(href && (~href.indexOf(website) || ! ~href.indexOf('http'))) {
        //只收集分类和终极页链接
				//if(~href.indexOf('GvodHtml') || moviePageRegex.test(href)) {
        if(~href.indexOf('.html')) {
					if(!regex.javascript.test(href)  &&  !regex.jsfile.test(href)) {
						var _url = href.replace(website,'');//移除站点名
						_url = _url.replace(regex.firstSlash,'');//移除第一个斜杠
						_url = _url.replace(regex.anchor,'');//移除锚点
						_urls.push(_url);
					}
				}
			}
		});*/
		return _urls;
	}
};