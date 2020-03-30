//css ./index.less
var React = require('react');
var axios = require('axios');
var validator = require('validator');
import Layout from '../../layout/index.jsx';

export default React.createClass({
	errorsObj: [],
	getInitialState() {
		return {
			validationError: false,
			validationMsg: '',
			responseError: false,
			responseErrMsg: '',
			isSubmittted: false
		};
	},
	getFormData: function () {
		return {
			email: this.refs.email.value
		};
	},
	handleClick: function (login) {
		login.preventDefault();
		var self = this;
		var data = this.getFormData();
		var validationMessage = [];
		if (!validator.isEmail(this.refs.email.value))
			validationMessage.push('Invalid Email');
		let msg = validationMessage.filter(function (val) {
			return val;
		}).join(', ');
		self.setState({
			validationMsg: msg,
			responseError: false
		});
		if (validationMessage.length == 0) {
			self.setState({
				validationError: false,
				responseError: false
			});
			// Submit form via axios/AJAX
			axios.post('/send_forgot_password_email', data)
				.then(function (response) {
					if (response.status === 200) {
						console.log(response.data);
						self.setState({
							responseError: false,
							isSubmittted: true
						});
					} else {
						self.setState({
							responseError: true,
							responseErrMsg: response.data.message
						});
					}
				})
				.catch(function (response) {
					self.setState({
						responseError: true,
						responseErrMsg: response.data.message
					});
				});
		} else {
			self.setState({
				validationError: true,
				responseError: false
			});
		}
	},
	render(){
		var rowContent;
		var validationContent;
		var responseErrContent = '';
		if(this.state.validationError)
		{
			validationContent = <div className="row">
									<div className="center">
										<div className="validationError">
											Validation Error : {this.state.validationMsg}
											<div className="space10"></div>
										</div>
									</div>
								</div>;
		}
		if(this.state.responseError)
		{
			responseErrContent = <div className="row">
									<div className="center">
										<div className="validationError">
											{this.state.responseErrMsg}
											<div className="space10"></div>
										</div>
									</div>
								</div>;
		}
		if (this.state.isSubmittted) {
			rowContent = <div className="row">
				<div className="col-md-12">
					<div className="center">
						<div className="tinytext">
							Please check your email for the password reset link.
						</div>
					</div>
				</div>
			</div>;
		} else {
			rowContent = <div className="row">
							<div className="col-md-12">
								<img src="images/email.svg" />
								<input type="email" placeholder="Email Address" name="email" ref="email" autoComplete="off" />
								<div className="space10"></div>
							</div>
							<div className="col-md-12 center">
								<a onClick={this.handleClick} className="border_white_btn border_blue_btn send_btn">Reset Password</a>
							</div>
						</div>;
		}

		return (<Layout {...this.props}>
			<div className="signup">
				<div className="grey_section">
					<div className="container">
						<div className="space20"></div>
						<div className="center">
							<div className="title underline underline_center">
							LOGIN
							</div>
						</div>
						<div className="space20"></div>
					</div>	
				</div>
				<div className="container">
					<div className="space30"></div>
					<div className="space20"></div>
					<div className="justify">
						{validationContent}
						{responseErrContent}
						{rowContent}
					</div>
					<div className="space30"></div>
				</div>
			</div>
			</Layout>);
	}
});

