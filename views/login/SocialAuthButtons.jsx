'use strict';
var React = require('react');

var SocialButton = React.createClass({
	socialLogin: function(){
	},
	render: function() {
		return (
			<button onClick={this.socialLogin} className={this.props.className}>
				<img src={this.props.icon} title={this.props.network}/>Sign in with {this.props.network}
			</button>
		);
	}
});

module.exports = React.createClass({
	getInitialState : function(){
		return { 
		};
	},
	render : function(){
		return (
			<span>
				<SocialButton url={this.props.action && this.props.action == 'login' ? '/api/login/external/Facebook' : '/api/registration/register-external/Facebook'} className='facebook-button' network='Facebook' icon='/public/images/btn_facebook.svg'></SocialButton>
				<SocialButton url={this.props.action && this.props.action == 'login' ? '/api/login/external/Google' : '/api/registration/register-external/Google'}  className='google-button' network='Google' icon='/public/images/btn_google_light_normal_ios.svg'></SocialButton>
			</span>
		);
	}
});