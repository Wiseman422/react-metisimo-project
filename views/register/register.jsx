/*import React from 'react';
import ReactDOM from 'react-dom';
import {Input, Form} from 'react-validation';
import axios from 'axios';
import classnames from 'classnames';
import _ from 'lodash';

export default React.createClass({
	getInitialState(){
		return {
			emailIsValid : true,
			usernameIsValid : true
		};
	},
	setValidationState(key, result){
		var isValid =  result.status == 200;
		var state = {};
		state[key] = isValid;
		this.setState(state);
		return isValid;
	},
	validateAsync(key) {
		var data = {};
		var value = ReactDOM.findDOMNode(this.refs[key]).value;
		var setValidationState = _.partial(this.setValidationState,key + 'IsValid');
		data[key] = value;
		return axios.post(
			'/validate/' + key,
			data,
			{headers : {'Content-Type' : 'application/json'}}
		).then(setValidationState)
		.catch(setValidationState);
	},
	validateUsername() {
		return this.validateAsync('username');
	},
	validateEmail() {
		return this.validateAsync('email');
	},
	onSubmit(event) {
		this.props.onSubmit();
		event.stopPropagation();
		event.preventDefault();
	},
	render() {
		var emailClassNames = classnames({ isValid : this.state.emailIsValid, isInvalid : !this.state.emailIsValid});
		var usernameClassNames = classnames({ isValid : this.state.usernameIsValid, isInvalid : !this.state.usernameIsValid});

		return <div className="register-container">
			<div className="sign-in-container">Already have an account? <a className="green-button" title="Sign In">Sign In</a></div>
			<h1>Sign up for free to post product reviews</h1>
			<div className="left-side">
				<img className="facebook" xsrc="/public/images/facebook_login.png" alt="Log in with Facebook"/>
				<img className="google" xsrc="/public/images/google_login.png" alt="Log in with Google"/>
				<div className="or">OR</div>
				<form onSubmit={this.onSubmit}>
					<h3>Create an Account</h3>
					<input type="text" className={usernameClassNames} placeholder="username*" required="required" ref="username" onBlur={this.validateUsername}/>
					<input type="text" placeholder="first name*" required="required"/>
					<input type="text" placeholder="last name*" required="required"/>
					<input type="email" className={emailClassNames} placeholder="e-mail address*" required="required" ref="email" onBlur={this.validateEmail}/>
					<div className="trigger-and-warning">
						<button className="green-button" type="submit">Register</button>
						<p>
							By signing up, you are agreeing to our
							<a alt="Healthy Beeps Terms and Privacy Policy" href="/privacy-policy" target="privacy-policy" title="Healthy Beeps Terms and Privacy Policy">Terms and Privacy Policy</a>.
						</p>
					</div>
				</form>
			</div>
			<div className="right-side">
				<h3>Getting started is easy:</h3>
				<ul>
					<li><div className="bullet" alt="Step 1">1</div><div>Submit Completed Form</div></li>
					<li><div className="bullet" alt="Step 2">2</div><div>Verify Email Address</div></li>
					<li><div className="bullet" alt="Step 3">3</div><div>Set Password &amp; Log in!</div></li>
				</ul>
			</div>
		</div>;
	}
});*/