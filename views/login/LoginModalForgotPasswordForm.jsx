'use strict';

var React = require('react');
var Formsy = require('formsy-react');
var LoginModalBaseInput = require('./LoginModalBaseInput.jsx');
var Logger = require('better-console');

function parseJSON(response) {
	return response.json();
}

module.exports = React.createClass({
	getInitialState : function(){
		return { 
			canSubmit: false
		};
	},
	enableButton: function () {
		this.setState({
			canSubmit: true
		});
	},
	disableButton: function () {
		this.setState({
			canSubmit: false
		});
	},
	submit: function (model) {

		let that = this;

		fetch('/api/login/forgot-password', {
			method: 'post',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json; charset=utf-8'
			},
			body: JSON.stringify({
				Email: model.Email
			}),
			credentials: 'same-origin'
		})
		.then(function(response){
			let error;
			switch (response.status){
			case 200:
				that.refs.form.updateInputsWithError({
					UserName: 'A reset code has been sent to you. Please check your email.'
				});
				return response;
			case 400: 
				that.refs.form.updateInputsWithError({
					Email: 'User not found.'
				});
				error = new Error(response.statusText);
				error.response = response;
				throw error;
			case 404:
				that.refs.form.updateInputsWithError({
					Email: 'User not found.'
				});
				error = new Error(response.statusText);
				error.response = response;
				throw error;
			default:
				error = new Error(response.statusText);
				error.response = response;
				throw error;
			}
		})
		.then(parseJSON)
		.then(function(data) {
			Logger.log('request succeeded with json response', data);
		}).catch(function(error) {
			Logger.log('Request failed.', error);
		});
	},
	render : function(){
		return (
			<div>
				<Formsy.Form noValidate ref='form' onValidSubmit={this.submit} onValid={this.enableButton} onInvalid={this.disableButton} >
					<LoginModalBaseInput name='Email' label='E-mail:' type='text' required/>
					<div className='text-center'>
						<button className='btn-default' type='submit' disabled={!this.state.canSubmit}>Click to reset your password</button>
					</div>
				</Formsy.Form>
			</div>
		);
	}
});