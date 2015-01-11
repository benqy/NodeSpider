//通用正则
var regex = require('../../helpers/regex.js');
var $;
module.exports = {
  init:function(jq){
    $ = jq;
  },
	grab: function(html,site,filters,accapts) {
		var _urls = [],website = 'http://'+site +'/';
		//取所有站内链接的url
		var links = html.find('a');
		links.each( function(i,n) {
			var href =$(n).attr('href');
			//仅限站内链接（即完整路径里包含站点host的,或者只写路径的
			if(href && (~href.indexOf(website) || ! ~href.indexOf('http'))) {
				var filterResult = false;
        //允许列表
        if(accapts){
          var k = accapts.length;
          while(k--){
            if(~href.indexOf(accapts[k])) {
              filterResult = true;
              break;
            }
          }
					//过滤配置的关键字
          if(filters) {
            var j = filters.length;
            while(j--) {
              if(~href.indexOf(filters[j])) {
                filterResult = false;
                break;
              }
            }
          }
        }
				if(filterResult) {
					if(!regex.javascript.test(href)  &&  !regex.jsfile.test(href)) {
						var _url = href.replace(website,'');//移除站点名
						_url = _url.replace(regex.firstSlash,'');//移除第一个斜杠
						_url = _url.replace(regex.anchor,'');//移除锚点
						_urls.push(_url);
					}
				}
			}
		});
		
		return _urls;
	}
}