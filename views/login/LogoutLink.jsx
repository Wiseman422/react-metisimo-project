'use strict';

var React = require('react');
var Logger = require('better-console');

function checkStatus(response) {
	if (response.status == 200) {
		return response;
	} else {
		var error = new Error(response.statusText);
		error.response = response;
		throw error;
	}
}

module.exports = React.createClass({
	getInitialState : function(){
		return { 
			view : 'logout'
		};
	},
	logOut: function(){
		fetch('/api/login/logout', {
			method: 'post',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json; charset=utf-8'
			},
			body: '{}',
			credentials: 'same-origin'
		})
		.then(checkStatus)
		.then(function(data) {
			Logger.log('request succeeded with json response', data);
			window.location.reload();
		}).catch(function(error) {
			Logger.log('Request failed.', error);
		});
	},
	render : function(){
		return (
			<a className='login' onClick={this.logOut}>Logout</a>
		);
	}
});