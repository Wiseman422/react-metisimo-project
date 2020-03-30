import _ from 'lodash';
import { Device } from 'met-data';
import logger from 'better-console';
import between from '../helpers/between';
import toTitleCase from '../helpers/toTitleCase';

export default [
	{
		routes: ['GET /device/search'],
		callback : function (req, res) {

			if (!req.authenticatedUserObj) {
				return Promise.resolve({
					redirect: '/signup'
				});
			}

			return Promise.resolve({
				view : 'device/search/index.jsx'
			});
		}
	},
	{
		routes: ['GET /device/search/json'],
		callback : function (request, response) {

			if (!request.authenticatedUserObj) {
				return Promise.resolve({
					redirect: '/signup'
				});
			}

			var searchParameter = request.query.search;
			var skip = parseInt(request.query.skip) || 0;
			var take = between(parseInt(request.query.take) || 25, 10, 100);
			return Device
				.query(function(collection){
					return collection
						.find({
							$or : [
								{ company_name : new RegExp(searchParameter,"i") },
								{ product_name : new RegExp(searchParameter,"i") },
								{ device_type : new RegExp(searchParameter,"i")  },
							]
						}, {
							product_name : 1,
							company_name : 1,
							disease_category : 1,
							product_score : 1,
							version : 1,
							price : 1,
							otc : 1,
							prescription : 1,
							events : 1
						})
						.skip(skip)
						.limit(take);
				})
				.then(function(data){
					return {
						json : data
					};
				});
		}
	},
	{
		routes: ['GET /device/:id'],
		callback : function (request, response, next) {
			if (!request.authenticatedUserObj) {
				return Promise.resolve({
					redirect: '/login'
				});
			}

			var id = request.params.id;
			return Device.findById(id)
				.then(function (result) {
					if (!result) {
						next();
						return;
					}

					_.each(['company_name', 'product_name', 'city', 'address'], key => {
						if(result[key])
							result[key]	= toTitleCase(result[key]);
					});

					return {
						view: 'device/detail/index.jsx',
						props: result
					};
				});
		}
	}
];
