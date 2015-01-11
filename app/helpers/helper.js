
/**
 * 得到一个数组不重复的元素集合<br/>
 * 唯一化一个数组
 * @returns {Array} 由不重复元素构成的数组
 */
Array.prototype.unique = function(){
	var newArray = [];
	var provisionalTable = {};
	for ( var i = 0, item; (item = this[i]) != null; i++) {
		if (!provisionalTable[item]) {
			newArray.push(item);
			provisionalTable[item] = true;
		}
	}
	return newArray;
};

Array.prototype.trim = function(){
	for(var i = 0,len = this.length;i<len;i++){
		this[i] = this[i].replace(/(^\s*)|(\s*$)/g, '');
	}
}

/**
 * 得到商品的分类部分路径
 * @param d {Object} 商品
 */
module.exports.getTypePath  = function(d){
	for(var k = 0 ,len = d.typeLinks.length;k<len;k++){
		d.typeLinks[k] = d.typeLinks[k].replace(/(^\s*)|(\s*$)/g, '');
	}
	return d.typeLinks.join('/');
}

module.exports.clearTypePath = function(d){
	return d.typeLinks.join('/').replace(/[^A-Za-z0-9\/]/g,'');
}