
/*
//import _ from 'lodash';

export default [
	{
		routes : ['GET /register', 'GET /account/register'],
		callback(req, res, next) {
			return {
				view : 'register/index.jsx'
			};
		}
	},
	{
		routes : ['POST /register'],
		callback(req, res, next){
			return {
				view : 'register/index.jsx'
			};
		}
	},
	{
		routes : ['POST /validate/email'],
		callback(req, res, next) {
			/*return tableQuery({
				from : 'AspNetUsers',
				where : {
					condition : 'Email eq ?',
					params : _.get(req.body,'email','').toLowerCase()
				}
			}).then(function(result){
				return {statusCode : result.entries.length ? 409 : 200};
			}); * /
		}
	},
	{
		routes : ['POST /validate/username'],
		callback(req, res, next) {
			/*return tableQuery({
				from : 'AspNetUsers',
				where : {
					condition : 'UserName eq ?',
					params : _.get(req.body,'username','').toLowerCase()
				}
			}).then(function(result){
				return {statusCode : result.entries.length ? 409 : 200};
			}); * /
		}
	}
];

*/