var memCache = {};
var Bluebird = require('bluebird');
module.exports = {
	get(path) {
		return Bluebird.resolve(memCache[path]);
	},
	exists(path){
		return Bluebird.resolve(!!memCache[path]);
	},
	save(path,options,contents){
		return Bluebird.resolve(memCache[path] = contents);
	},
	remove(path){
		delete memCache[path];
		return Bluebird.resolve();
	}
};