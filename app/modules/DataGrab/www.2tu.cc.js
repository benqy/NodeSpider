var repairImgUrl = function(url) {
	if(url.indexOf('http://www.sinomart.com') == -1) {
		url = url.replace(/^\//,'');
		url = 'http://www.sinomart.com/' + url;
	}
	return url;
};
var regex = require('../../helpers/regex.js');
var helper = require('../../helpers/helper.js');
var idRegex = /^.*GP(\d*)\.html$/;
module.exports = {
	grapMovie: function(html,$,url) {
    var data;
    var idCatchs = url.match(idRegex);
    if(idCatchs && idCatchs[1]){
      data = {url:url};
    	data.id = idCatchs[1];
      data.catalog = [];
      var wzContents = html.find('.wz').contents()
      wzContents.each(function(i,n){
        if(i>2){
          var cataName = $(n).text().replace('»','').trim();
          if(cataName){
            data.catalog.push(cataName);
            if(i == wzContents.length-1){
              data.name = cataName;
            }
          }
        }
      });
      data.tu2Pic = html.find('.pic img').attr('src');
      data.seoName = html.find('.info h1').text();
      var infoLis = html.find('.info ul li');
      data.age = infoLis.eq(0).contents().eq(1).text();
      data.tu2Status = infoLis.eq(0).contents().eq(3).text();
      data.tags = [];
      infoLis.eq(1).find('a').each(function(i,n){
        data.tags.push($(n).text());
      });
      data.actors = [];
      infoLis.eq(2).find('a').each(function(i,n){
        data.actors.push($(n).text());
      });
      data.area = infoLis.eq(3).contents().eq(1).text();
      data.tu2UpdateTime = infoLis.eq(4).find('div').contents().eq(1).text();
      data.desc = html.find('.endtext').text();
      data.star = html.find('#start').attr('class');
      data.updatetps = html.find('.updatetps').text();
      data.metas = [];
      html.filter('meta').each(function(i,n){
        data.metas.push($(n).attr('content'));
      });
    }
    return data;
	}
};