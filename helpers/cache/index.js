var
	_ = require('lodash'),
	fs = require('fs'),
	logger = require('better-console'),
	Bluebird = require('bluebird'),
	config = require('../../config'),
	cacheType = config('cache.type') || 'mem',
	strategy = require('./' + cacheType + 'Strategy');

module.exports = {
	load(name,options,callback){
		// redefine arguments
		options = arguments.length > 2 ? arguments[1] : {};
		callback = _.last(arguments);

		if(!_.isFunction(callback)){
			throw 'The last argument of \'load\' must be a function.';
		}

		return new Bluebird(function (resolve) {
			strategy.exists(name).then((exists) => {
				if (exists) {
					resolve(strategy.get(name));
				} else {
					if (callback.length > 0){
						callback(function(result){
							resolve(strategy.save(name,options,result));
						});
					} else {
						resolve(strategy.save(name,options,callback()));
					}
				}
			});
		});
	},
	get(name) {
		return Bluebird.resolve().then(_.partial(strategy.get,name));
	},
	exists(name){
		return Bluebird.resolve().then(_.partial(strategy.exists,name));
	},
	save(name,options,contents){
		// redefine arguments

		try{
			options = arguments.length > 2 ? arguments[1] : {};
			contents = _.last(arguments);

			if(_.isFunction(options.expires)){
				options.expires(function(){
					strategy.remove(name);
				});
			}

			var callback = _.partial(strategy.save,name,options,contents);
			return Bluebird.resolve().then(callback);
		} catch (e){
			logger.error(e);
		}
	},
	remove(name){
		return Bluebird.resolve().then(_.partial(strategy.remove,name));
	},
	expireOnFileChange(){
		var files =_.flattenDeep(_.toArray(arguments));
		return function(callback){
			_.each(files,function(item){
				fs.watchFile(item,{ interval : 1000 },function(){
					logger.info('Expiring cache for ', item);
					callback();
				});
			});
		};
	},
	expireOnDate(/*date*/){
		return function(/*callback*/){
			throw 'not implemented';
		};
	},
	expireOnElapsed(milliseconds){
		return function(callback){
			setTimeout(callback,milliseconds);
		};
	}
};