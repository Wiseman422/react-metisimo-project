var
	_ = require('lodash'),
	fs = require('fs'),
	Bluebird = require('bluebird'),
	logger = require('better-console'),
	url = require('url'),
	less = require('less'),
	path = require('path'),
	regex = /\.less$/,
	cache = require('../helpers/cache'),
	config = require('../config'),
	defaultOptions = {
		src : '',
		force : false,
		compress : true
	},
	options = {},
	readFile = Bluebird.promisify(fs.readFile),
	lstat = Bluebird.promisify(fs.lstat);

function log(key, val, type) {
	if(options.debug || type === 'error') {
		if (!_.isFunction(logger[type])) {
			type = 'log';
		}
		logger[type]('  [90m%s : [0m  [36m%s [0m', key, val);
	}
}

function lessError(err,res,next) {
	// create a user friendly error
	var message = [];
	message.push(err.message);
	message.push('Line :' + err.line.toString());
	message.push('Index :' + err.index.toString());
	message.push('-------------------------------------------------------');
	_.each(err.extract,function(value){
		message.push(value);
	});
	res.set('Content-Type', 'text/plain');
	res.send(message.join('\n'));

	// log to the console
	log('LESS ' + err.type + ' error', err.message, 'error');
	log('LESS File', err.filename + ' ' + err.line + ':' + err.column, 'error');
	return next(err);
}

function send(response, pathname, result){
	logger.info('Serving ', pathname);
	response.set('Content-Type', 'text/css');
	response.send(result.css);
}

module.exports = function(custom_options){

	if(_.isString(custom_options)){
		custom_options = { src : custom_options };
	}

	_.extend(options,defaultOptions,custom_options);

	return function(request,response,next){

		if ('GET' != request.method.toUpperCase() && 'HEAD' != request.method.toUpperCase()) {
			return next();
		}

		var pathname = options.src + url.parse(request.url).pathname;
		var sendPartial = _.partial(send,response,pathname);

		// if the file does not end in .less, leave the method.
		if(!regex.test(pathname)){
			return next();
		}

		cache.exists(pathname).then(function(exists){
			if(exists) {
				cache.get(pathname).then(sendPartial);
			} else {
				Bluebird
					.join(readFile(pathname,'utf8'),lstat(pathname))
					.spread(function(str,stats){
						var lessOptions = {
							paths: [path.dirname(pathname)],
							filename : pathname,
							yuicompress : config('compress-styles') || false
						};

						less.render(str,lessOptions,function(err,output){
							if(err){
								lessError(err,response,next);
							}

							var result = {
								path : pathname,
								css : output.css,
								map : output.map,
								mtime : stats.mtime
							};

							sendPartial(result);

							cache.save(pathname,{
								expires: cache.expireOnFileChange(pathname,output.imports)
							},result);
						});
					})
					.catch(function(err){
						next('ENOENT' == err.code ? null : err);
					});
			}
		});
	};
};