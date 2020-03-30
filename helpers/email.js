import _ from 'lodash';
import nodemailer from 'nodemailer';
import logger from 'better-console';
import AWS from 'aws-sdk';
import render from '../rendering/render-react.js';
import config from '../config';

const awsConfig = config('aws');
AWS.config.update(awsConfig);

export default function(mailOptions, view, request) {
	var transporter = nodemailer.createTransport(({
		SES: new AWS.SES({
			apiVersion: '2010-12-01'
		}),
		sendingRate: 1 // max 1 messages/second
	}));
	var options = _.pick(mailOptions, 'from', 'to', 'subject');
	options.ses = {
		// Tags: [{
		// 	Name: 'tag name',
		// 	Value: 'tag value'
		// }]
	};

	if(_.isString(view)){
		options.html = render(request, null, {view, props: mailOptions.props,
			layout: null
		});
	} else {
		options.html = mailOptions.content;
	}

	// send mail
	return transporter.sendMail(options, function(error, info) {
		if (error) {
			logger.error(error);
		} else {
			logger.log('Message sent: ' + info.messageId);
		}
		transporter.close();
	});
}
