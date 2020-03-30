import reactRender from '../rendering/render-react';
import logger from 'better-console';
import Bluebird from 'bluebird';
import _ from 'lodash';
import { Router } from 'express';
import readdirRecursive from 'recursive-readdir';
import pathUtil from "path";
import createError from 'http-errors';

var router = Router();

function readDir(path){
	return new Bluebird(function(resolve){

		var controllersPath = pathUtil.join(__dirname, '../controllers/' + path);
		readdirRecursive(controllersPath,function(err,files){
			if(err){
				logger.warn('Directory ' + path + ' does not exist.');
				resolve([]); // if there is a failure, do nothing
			} else {
				resolve(_(files)
					.filter((file) => /Controller\.js$/.test(file))
					.value());
			}
		});
	});
}

function parseController(files){
	return _.map(_.flattenDeep(files),(file) => {
		var actions = require(file);

		// make sure that we can use ES6 defaults here
		if(actions.default){
			actions = actions.default;
		}

		logger.log('Controller ' + file + ' added');
		return _.map(actions,addAction);
	});
}

function addAction(action){
	var routes = _.flattenDeep([action.routes]);
	return _.map(routes,_.partial(getRoutes,action));
}

function getRoutes(action, route){
	var split = route.split(' ');
	var method = split.length === 2 ? split[0].toLowerCase() : 'get';
	var path = _.last(split);
	return {
		method : method,
		path : path,
		callback : action.callback
	};
}

const finalCallback = callback => (request,response,next) =>
	Promise.resolve(true)
		.then(() =>
			_.isFunction(callback) ? callback(request,response,next) : callback
		)
		.then(result => {
			logger.info('Serving request for ' + request.url);
			if (!result) {
				return next(new createError.InternalServerError('Controller didnt return anything'));
			}

			if(result.statusCode){
				response.statusCode = result.statusCode;
			}

			if(result.statusMessage){
				response.statusMessage = result.statusMessage;
			}

			if(result.headers) {
				response.writeHead(response.statusCode, result.headers);
			}

			if(result.redirect) {
				logger.info('Redirecting to ' + result.redirect);
				return response.redirect(result.redirect);
			} else if(result.view){
				return response.send(reactRender(request,response,result));
			} else if(_.isString(result)){
				return response.send(result);
			} else if(result.json){
				return response.send(JSON.stringify(result.json));
			}

			return new createError.InternalServerError('Unknown response from controller');
		}).catch((error) => {
			logger.error("REQUEST ERROR:", error.message, error.stack);
			next(new createError.InternalServerError('Controller throwed: ' + error));
			// response.end();
		});

function addRoute(route){
	logger.info(['Adding route:', route.method,route.path].join(' '));

	if (_.isArray(route.callback)) {
		const middlewares = _.slice(route.callback, 0, route.callback.length - 1);
		const callback = [
			...middlewares,
			finalCallback(_.last(route.callback))
		];

		router[route.method](route.path, ...callback);
	}

	router[route.method](route.path, finalCallback(route.callback));

	//var args = _.filter(_.flatten([route.path, callbacks ,finalCallback]));
	//_.invoke(router,route.method, args);
}

var result = function(){
	return Bluebird
		.join(readDir('./'))
		.then(_.union)
		.then(parseController)
		.then(_.flattenDeep)
		.then(_.partialRight(_.each,addRoute))
		.thenReturn(router);
};

result.getRoutes = getRoutes;

module.exports = result;
