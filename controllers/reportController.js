/*
import hbproducts from '../../config/hbproducts.json';
import _ from 'lodash';

module.exports = [
	{
		routes : ['GET /reports'],
		callback : function(req, res){
			return {
				view: 'report/index.jsx',
				props: {hbproduct: hbproducts}
			};
		}
	},
	{
		routes: ['GET /reports/:hbproductid'],
		callback: function(req, res){
			var id = req.params.hbproductid;
			var hbproduct = _.find(hbproducts, {id: id});
			return {
				view: 'report-description/index.jsx',
				props: {hbproduct: hbproduct}
			};
		}
	}
];

*/