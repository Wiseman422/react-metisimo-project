var crypto = require('crypto');
module.exports = function (name){
	var md5sum = crypto.createHash('md5');
	md5sum.update(name);
	var hash = md5sum.digest('hex');
	return hash;
};