'use strict';

var React = require('react');
var Modal = require('react-modal');
var LoginModalSignInForm = require('./LoginModalSignInForm.jsx');
var LoginModalForgotPasswordForm = require('./LoginModalForgotPasswordForm.jsx');

const modalStyle = {
	overlay : {
		backgroundColor   : 'rgba(0, 0, 0, 0.75)'
	},
	content : {
		width             : '100%',
		maxWidth          : '420px',
		padding           : '0',         
		border            : 'none',
		backgroundColor   : 'transparent',
		overflow          : 'visible',
		top               : '50%',
		left              : '50%',
		bottom            : 'auto',
		right             : 'auto',
		transform         : 'translate(-50%, -50%)'
	}
};

module.exports = React.createClass({
	getInitialState : function(){
		return { 
			view                 : 'login', 
			canSubmit            : false,
			isModalOpen          : false,
			isSignInOpen         : true,
			isForgotPasswordOpen : false
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
	openModal : function(){
		this.setState({ isModalOpen: true });
	},
	closeModal : function(){
		this.setState({ isModalOpen: false });
	},
	handleModalCloseRequest: function() {
		// opportunity to validate something and keep the modal open even if it
		// requested to be closed
		this.setState({ isModalOpen: false});
	},
	forgotPasswordHandler:function() {
		this.setState({ 
			isForgotPasswordOpen: true,
			isSignInOpen: false
		});
	},
	signInHandler:function() {
		this.setState({ 
			isForgotPasswordOpen: false,
			isSignInOpen: true
		});
	},
	verifyHandler:function() {
		this.setState({ 
			isForgotPasswordOpen: false,
			isSignInOpen: false
		});
	},
	render : function(){
		var loginModalBody;
		if (this.state.isSignInOpen) {
			loginModalBody = <LoginModalSignInForm />;
		} else if (this.state.isForgotPasswordOpen) {
			loginModalBody = <LoginModalForgotPasswordForm />;
		} 
		return <Modal isOpen={this.state.isModalOpen} onRequestClose={this.handleModalCloseRequest} style={modalStyle} id='loginbox' className='modal-dialog'>
			<div id='loginbox' className='modal-content'>
				<div className='modal-header'>
					<button type='button' className='close' onClick={this.closeModal}><span aria-hidden='true'>×</span><span className='sr-only'>Close</span></button>
					<div className='row'>
						<h4 className='modal-title col-sm-7'>
							{this.state.isSignInOpen ? 'Please Sign In' : ''}
							{this.state.isForgotPasswordOpen ? 'Password Reset' : ''}
						</h4>
						<ul className='action-links col-sm-5 text-right'>
							<li className={this.state.isForgotPasswordOpen ? 'hidden' : ''} ><a onClick={this.forgotPasswordHandler}>Forgot Your Password? »</a></li>
							<li className={this.state.isSignInOpen ? '' : 'hidden'}><a href='/account/register'>Create New Account</a></li>
							<li className={this.state.isForgotPasswordOpen ? '' : 'hidden'}><a onClick={this.signInHandler}>« Sign In</a></li>
						</ul>
					</div>
				</div>
				<div className='modal-body'>
					{loginModalBody}
				</div>
			</div>
		</Modal>;
	}
});