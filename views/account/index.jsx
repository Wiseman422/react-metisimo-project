//css ./index.less
import React from 'react';
import axios from 'axios';
import Validator from '../../validators';
import Layout from '../layout/index.jsx';

const validator = new Validator();

export default React.createClass({
	errorsObj: [],
	getInitialState() {
		return {
			accountSubmitted: false,
			accountValidationError: false,
			accountValidationMsg: '',
			submitted: false,
			validationError: false,
			validationMsg: '',
			responseErr: false,
			responseErrMsg: '',

			email: this.props.accountInfo.email,
			firstname: this.props.accountInfo.firstname,
			lastname: this.props.accountInfo.lastname,
			phone: this.props.accountInfo.phone,
			organization: this.props.accountInfo.organization,
			title: this.props.accountInfo.title
		};
	},
	getAccountData: function () {
		return {
			email: this.refs.email.value,
			firstname: this.refs.first_name.value,
			lastname: this.refs.last_name.value,
			phone: this.refs.phone.value,
			organization: this.refs.organization.value,
			title: this.refs.title.value
		};
	},
	saveChanges: function (account) {
		account.preventDefault();
		var self = this;
		var data = this.getAccountData();

		validator.reset();
		validator.email('Invalid Email', this.refs.email.value);
		validator.required('First Name is required', this.refs.first_name.value);
		validator.required('Last Name is required', this.refs.last_name.value);
		validator.required('Phone is required', this.refs.phone.value);
		// if (!validator.isMobilePhone(this.refs.phone.value, 'en-US'))
		// 	validationMessage.push('Invalid Phone Number');
		validator.required('Organization is required', this.refs.organization.value);
		if (!validator.isValid()) {
			this.setState({
				accountValidationMsg: validator.messages().join(', '),
				accountValidationError: true,
				responseErr: false
			});

			return;
		}

		this.setState({
			accountValidationError: false,
			responseErr: false
		});
		// Submit form via axios/AJAX
		axios.put('/account', data)
			.then(function (response) {
				if (response.status === 200) {
					self.setState({
						accountSubmitted: true,
						responseErr: false
					});
				} else {
					self.setState({
						responseErr: true,
						responseErrMsg: response.data ? response.data.message : 'unknown error'
					});
				}
			})
			.catch(function (response) {
				self.setState({
					responseErr: true,
					responseErrMsg: response.data ? response.data.message : 'unknown error'
				});
			});
	},

	updatePassword: function (updatepassword) {
		updatepassword.preventDefault();
		var self = this;
		var data = {
			password: this.refs.newpassword.value
		};

		validator.reset();
		validator.required('New Password is required', this.refs.newpassword.value);
		validator.required('Confirm Password is required', this.refs.confirmpassword.value);
		validator.match('Passwords do not match', [this.refs.newpassword.value, this.refs.confirmpassword.value]);
		validator.password('Password is not strong enough', this.refs.newpassword.value);

		if (!validator.isValid()) {
			this.setState({
				validationMsg: validator.messages().join(', '),
				validationError: true,
				responseErr: false
			});

			return;
		}
		this.setState({
			validationError: false,
			responseErr: false
		});
		// Submit form via axios/AJAX
		axios.post('/changePassword', data)
			.then(function (response) {
				if (response.status === 200) {
					self.setState({
						submitted: true,
						responseErr: false
					});
				} else {
					self.setState({
						responseErr: true,
						responseErrMsg: response.data ? response.data.message : 'unknown error'
					});
				}
			})
			.catch(function (response) {
				self.setState({
					responseErr: true,
					responseErrMsg: response.data ? response.data.message : 'unknown error'
				});
			});
	},
	handleChange(field) {
		return (e) => {
			console.log(e);
			this.setState({
				[field]: this.getAccountData()[field]
			});
		};
	},
	render() {
		var accountRowContent;
		var accountValidationContent;
		var rowContent;
		var validationContent;
		var responseErrContent;

		if(this.state.accountValidationError)
		{
			accountValidationContent =  <div className="row">
											<div className="center">
												<div className="validationError">
													Validation Error : {this.state.accountValidationMsg}
													<div className="space10"></div>
												</div>
											</div>
										</div>;
		}

		if (this.state.responseErr) {
			responseErrContent = <div className="row">
											<div className="center">
												<div className="validationError">
													{this.state.responseErrMsg}
													<div className="space10"></div>
												</div>
											</div>
										</div>;
		}

		if(this.state.accountSubmitted)
		{
			accountRowContent = <div className="row">
									<div className="center">
										<div className="tinytext">
											Account has been updated Successfully.
										</div>
									</div>
								</div>;
		}
		else
		{
			accountRowContent = <div className="row">
									<div className="left">
										<div className="subtitle">
											Account Settings
										</div>
									</div>
									<div className="col-md-6">
										<img src="images/f_n.svg" />
										<input type="text" placeholder="*First Name" name="first_name"
											ref="first_name" autoComplete="off" value={this.state.firstname} onChange={this.handleChange('firstname')}/>
										<div className="space10"></div>
									</div>
									<div className="col-md-6">
										<img src="images/f_n.svg" />
										<input type="text" placeholder="*Last Name" name="last_name"
											ref="last_name" autoComplete="off" value={this.state.lastname} onChange={this.handleChange('lastname')}/>
										<div className="space10"></div>
									</div>
									<div className="col-md-6">
										<img src="images/email.svg" />
										<input type="email" placeholder="*Email Address" name="email"
											ref="email" autoComplete="off" value={this.state.email} onChange={this.handleChange('email')} />
										<div className="space10"></div>
									</div>
									<div className="col-md-6">
										<img src="images/tel.svg" />
										<input type="text" placeholder="*Phone" name="phone"
											ref="phone" autoComplete="off" value={this.state.phone} onChange={this.handleChange('phone')} />
										<div className="space10"></div>
									</div>
									<div className="col-md-6">
										<img src="images/org.svg" />
										<input type="text" placeholder="*Organization" name="organization"
										ref="organization" autoComplete="off" value={this.state.organization} onChange={this.handleChange('organization')} />
										<div className="space10"></div>
									</div>
									<div className="col-md-6">
										<img src="images/title.svg" />
										<input type="text" placeholder="Job Title" name="title"
											ref="title" autoComplete="off" value={this.state.title} onChange={this.handleChange('title')}/>
										<div className="space10"></div>
									</div>
									<div className="col-md-12 right">
										<a onClick={this.saveChanges} className="border_white_btn border_blue_btn send_btn">Save Changes</a>
									</div>
								</div>;
		}

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

		if(this.state.submitted)
		{
			rowContent = <div className="row">
							<div className="center">
								<div className="tinytext">
									Password has been updated Successfully.
								</div>
							</div>
						</div>;
		}
		else
		{
			rowContent = <div className="row">
							<div className="left">
								<div className="subtitle">
								Change Password
								</div>
							</div>
							<div className="col-md-12">
								<img src="images/org.svg" />
								<input type="password" placeholder="New Password" name="newpassword" ref="newpassword" autoComplete="off" />
								<div className="space10"></div>
							</div>
							<div className="col-md-12">
								<img src="images/org.svg" />
								<input type="password" placeholder="Confirm Password" name="confirmpassword" ref="confirmpassword" autoComplete="off" />
								<div className="space10"></div>
							</div>
							<div className="col-md-12">
								<div className="center">
									<div className="tinytext">
										Passwords must have a minimum length of 8 characters and have at least one character from each of these groups: uppercase, lowercase, numbers, and symbols.
									</div>
								</div>
							</div>
							<div className="col-md-12 right">
								<a onClick={this.updatePassword} className="border_white_btn2 border_blue_btn send_btn">Save New Password</a>
							</div>
						</div>;
		}
		return (<Layout {...this.props}>
					<div className="account">
						<div className="grey_section">
							<div className="container">
								<div className="space20"></div>
								<div className="center">
								<div className="title underline underline_center">
								ACCOUNT
								</div>
								</div>
								<div className="space20"></div>
							</div>
						</div>
						<div className="container">
							<div className="space30"></div>
							<div className="space20"></div>
							<div className="justify">
							{accountValidationContent}
							{responseErrContent}
							{accountRowContent}
							{validationContent}
							{rowContent}
							</div>
							<div className="space30"></div>
						</div>
					</div>
				</Layout>);
	}
});
