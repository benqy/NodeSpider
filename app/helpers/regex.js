//常用正则
module.exports = {
	javascript:/javascript/,
	jsfile:/\.js/,
	anchor:/#\w*/,
	firstSlash:/^\//,
	notint:/\D/,//非数字
	notNumber:/[^0-9\.]/, //非数字，但包括小数点
	getUrlArr: function(url) {//取url数组，依次为：协议，域名，路径，文件名
		var re = /(\w+):\/\/([^\:|\/]+)(\:\d*)?(.*\/)([^#|\?|\n]+)?(#.*)?(\?.*)?/i;
		var arr = url.match(re);
		var result = [];
		result.push(arr[1]);
		result.push(arr[2]);
		result.push(arr[4]);
		result.push(arr[5]);
		return result;
	}
}