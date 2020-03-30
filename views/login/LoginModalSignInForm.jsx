'use strict';

var React = require('react');
var Formsy = require('formsy-react');
var SocialAuthButtons = require('./SocialAuthButtons.jsx');
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

		fetch('/api/login', {
			method: 'post',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json; charset=utf-8'
			},
			body: JSON.stringify({
				UserNameOrEmail: model.UserNameOrEmail,
				Password: model.Password
			}),
			credentials: 'same-origin'
		})
			.then(function(response){
				let error;
				switch (response.status){
				case 200: 
					window.location = '/';
					return response;
				case 404: 
					that.refs.form.updateInputsWithError({
						UserName: 'User not found.'
					});
					error = new Error(response.statusText);
					error.response = response;
					throw error;
				case 401: 
					that.refs.form.updateInputsWithError({
						UserName: 'Bad credentials, or account not activated.'
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
					<LoginModalBaseInput name='UserNameOrEmail' label='E-mail/Username:' type='text' required/>
					<LoginModalBaseInput name='Password' label='Password:' type='password' required/>
					<div className='text-center'>
						<button className='btn-default' type='submit' disabled={!this.state.canSubmit}>Click to sign in</button>
					</div>
				</Formsy.Form>
				
				<div className='social-buttons'>
					<fieldset>
						<legend>OR</legend>
					</fieldset>
					<SocialAuthButtons action='login' />
				</div>
				<div className='login_messages' style={{display: 'none'}}>
					<span className='loggedout'>Sign in could not be completed. Please try again.</span>
					<span className='loggedin'>Sign in successful!</span>
				</div>
			</div>
		);
	}
});