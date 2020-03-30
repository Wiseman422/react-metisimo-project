/*

import { Product } from 'hb-data';
import _ from 'lodash';

module.exports = [
	{
		routes : 'GET /search',
		callback : function(request, response, next) {
			var search = request.query.search;
			var skip = request.query.skip || 0;
			var take = 25; //request.query.take; _.clamp( || 25, 1,100);
			var params = {};
			if (search) {
				params.tabsValue = search;
			}
			return Product.find(params, {skip: skip, limit: take, returnCount: true})
				.then(function(items){
					return {
						view : 'search/index.jsx',
						props : {
							term : search ? search : '',
							take : take,
							pageCount : Math.ceil(items.totalCount / take),
							currentPage : Math.floor(skip / take),
							items: items.items
						}
					};
				});
		}
	}
];

*/