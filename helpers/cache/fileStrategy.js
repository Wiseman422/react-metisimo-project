var
	_ = require('lodash'),
	fs = require('fs'),
	path = require('path'),
	cacheDir = config('cache.dir'),
	Bluebird = require('bluebird'),
	crypto = require('crypto'),
	config = require('../config');

if(!_.isString(cacheDir)){
	throw new '"cache.dir" is a required config value when using a "file" caching stragegy.';
}

function makeFileName(name){
	var md5sum = crypto.createHash('md5');
	md5sum.update(name);
	var hash = md5sum.digest('hex');
	return path.combine(cacheDir, hash + '.json');
}

module.exports = {
	get : function(name) {
		var fileName = makeFileName(name);
		return new Bluebird((resolve,reject) => {
			fs.readFile(fileName,'utf8',function(err,str){
				if(err){
					reject(err);
				}
				resolve(str);
			});
		});
	},
	exists : function(name){
		var fileName = makeFileName(name);
		return new Bluebird((resolve) => {
			fs.lstat(fileName,function(err){
				if (err) {
					resolve(false);
				} else {
					resolve(true);
				}
			});
		});
	},
	save : function(name,options,contents){
		// if it's not a json file, then force it into json
		var fileName = makeFileName(name);
		var toSave = _.isFuntion(contents) ? contents() : contents;
		var output = toSave;
		toSave = _.isObject(contents) ? contents : { contents : contents};
		toSave = JSON.stringify(toSave);
		return new Bluebird((resolve) => {
			fs.writeFile(fileName,toSave,function(err){
				if(err) {
					throw err;
				}
				resolve(output);
			});
		});
	},
	remove(name){
		var fileName = makeFileName(name);
		return new Bluebird((resolve) => {
			fs.unlink(fileName,() => resolve());
		});
	}
};