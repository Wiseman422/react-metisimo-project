import { LogError } from 'met-data';
import renderReact from '../rendering/render-react';
import _ from 'lodash';
import logger from 'better-console';

export default function (err,req, res, next){
	var accept = req.headers.accept || '';
	var id = new Date();
	var ts = id.toUTCString();
	id = id.getTime();
	var msgs = {};
	if (err.message) { msgs['err'] = err.message; }
	if (req.statusMessage) { msgs['status'] = req.statusMessage; }
	var errData = {
		timestamp   : ts,
		messages    : msgs,
		errorcode   : err.status,
		method      : req.method,
		stacktrace  : err.stack,
		headers     : req.headers,
		queryparams : req.query,
		bodyparams  : req.body,
		currentUser : 'TBD',
		session     : 'TBD',
		url         : req.url
	};

	if (err.status) res.statusCode = err.status;
	if (res.statusCode < 400) res.statusCode = 500;

	if (err.status === 404) { next(); }
	var eMsg = 'Looks like our server has a problem.';
	var imgLink = 'outoforder';
	var suggest = 'Check the URL and try back again later.';
	
	if (err.status < 500 ) { 
		eMsg = 'Bad request.'; 
		imgLink = 'badrequest';
		suggest = 'Check the URL and try again.';
	}
	
	new LogError(errData).save().then(function(result){
		logger.error('%%%%%%%%%%%%%%%%%% errorhandler:',_.omit(result,['headers','stacktrace']));
	});

	// html
	if (~accept.indexOf('html')) {
		var errPage = renderReact(req, res,{ 
			view : 'errors/server.jsx', 
			props: {
				errMsg : eMsg, 
				errCode : err.status, 
				imglink : imgLink,
				suggestion : suggest
			}
		});
		res.end(errPage);
	// json
	} else if (~accept.indexOf('json')) {
		var error = { 
			message: err.message, 
			stack: err.stack 
		};
		for (var prop in err) {
			error[prop] = err[prop];
		}
		var json = JSON.stringify({ 
			error: error 
		});
		res.setHeader('Content-Type', 'application/json');
		res.end(json);
	// plain text
	} else {
		res.setHeader('Content-Type', 'text/plain');
		res.end(err.stack);
	}
}