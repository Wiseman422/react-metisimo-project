/*
 * Created by jhelmuth on 5/25/16.


import _ from 'lodash';
import validator from 'validator';
import { EmailEntry } from 'hb-data';
import logger from 'better-console';

export default [
	{
		routes: ['POST /subscribe'],
		callback(req, res, next){
			let email = (_.get(req.body, 'email', '')+'').toLowerCase();
			if (! validator.isEmail(email)) {
				logger.log('/subscribe not a valid email address.');
				return { statusCode: 400, statusMessage: 'Invalid Email Address', json: { message: 'Invalid Email Address'}};
			}
			logger.log('/subscribe saving email to database');
			return new EmailEntry({ email })
				.save()
				.then(function() {
					logger.log('/subscribe save complete.');
					return { statusCode: 200, json: { message: 'Email Address Added to List'} };
				});
		}
	}
];
 */