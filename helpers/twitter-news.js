'use strict';
var Bluebird = require('bluebird');
var Twitter = require('twitter');
var config = require('../config');
var client  = new Twitter({
	consumer_key: config('twitter.twitterConsumerKey'),
	consumer_secret: config('twitter.twitterConsumerSecret'),
	access_token_key: config('twitter.twitterAccessTokenKey'),
	access_token_secret: config('twitter.twitterAccessTokenSecret')
});
import _ from 'lodash';

export default function(count){
	return new Bluebird(function(resolve, reject){
		client.get('statuses/user_timeline', function(error, tweets, response){
			var results = { };
			if (error) { 
				reject(error);
			} else {
				results = _.map(tweets.slice(0,count), (item) => ({
					text : item.text,
					date : item.created_at,
					url : _.get(item,'entities.urls[0].url')
				}));
			}
			resolve(results);
		});
	});
}
