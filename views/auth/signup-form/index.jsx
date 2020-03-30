//css ./index.less
import React from 'react';
import axios from 'axios';
import Validator from '../../../validators';
import Layout from '../../layout/index.jsx';

const validator = new Validator();

export default React.createClass({
	errorsObj: [],
	getInitialState() {
		return {
			submitted: false,
			validationError: false,
			validationMsg: '',
			responseError: false,
			responseErrMsg: ''
		};
	},
	getSignupData: function () {
		return {
			firstname: this.refs.first_name.value,
			lastname: this.refs.last_name.value,
			phone: this.refs.phone.value,
			organization: this.refs.organization.value,
			email: this.refs.email.value,
			title: this.refs.title.value,
			usage: this.refs.usage.value,
			password: this.refs.create_password.value
		};
	},
	handleClick: function (signup) {
		signup.preventDefault();
		var data = this.getSignupData();

		validator.reset();
		validator.email('Invalid Email', this.refs.email.value);
		validator.required('First Name is required', this.refs.first_name.value);
		validator.required('Last Name is required', this.refs.last_name.value);
		validator.required('Phone is required', this.refs.phone.value);
		validator.required('Organization is required', this.refs.organization.value);
		validator.required('Create Password is required', this.refs.create_password.value);
		validator.required('Confirm Password is required', this.refs.confirm_password.value);
		validator.match('Passwords do not match', [this.refs.create_password.value, this.refs.confirm_password.value]);
		validator.password('Password is not strong enough', this.refs.create_password.value);

		if (!validator.isValid()) {
			this.setState({
				validationMsg: validator.messages().join(', '),
				validationError: true,
				responseError: false
			});

			return;
		}

		this.setState({
			validationError: false
		});

		// Submit form via axios/AJAX
		axios
			.post('/signup', data)
			.then(response => {
				if (response.status === 201) {
					this.setState({
						submitted: true,
						responseError: false
					});
				} else {
					this.setState({
						responseError: true,
						responseErrMsg: response.data.message
					});
				}
			})
			.catch(response => {
				this.setState({
					responseError: true,
					responseErrMsg: response.data.message
				});
			});
	},
	render() {
		var rowContent;
		var validationContent;
		var responseErrContent = '';
		if (this.state.validationError) {
			validationContent = <div className="row">
				<div className="col-md-12">
					<div className="center">
						<div className="validationError">
							Validation Error : {this.state.validationMsg}
							<div className="space10"></div>
						</div>
					</div>
				</div>
			</div>;
		}
		if (this.state.responseError) {
			responseErrContent = <div className="row">
				<div className="col-md-12">
					<div className="center">
						<div className="validationError">
							{this.state.responseErrMsg}
							<div className="space10"></div>
						</div>
					</div>
				</div>
			</div>;
		}

		if (this.state.submitted) {
			rowContent = <div className="row">
				<div className="col-md-12">
					<div className="center">
						<div className="subtitle">
							Confirm your identity
						</div>
					</div>
					<div className="center">
						<div className="tinytext">
							Click the link sent to your email to confirm your account.
						</div>
					</div>
				</div>
			</div>;
		}
		else {
			rowContent = <div className="row">
					<div className="col-md-6">
						<img src="images/f_n.svg"/>
						<input type="text" placeholder="*First Name" name="first_name" className="form-control" ref="first_name" autoComplete="off"/>
						<div className="space10"></div>
					</div>
					<div className="col-md-6">
						<img src="images/f_n.svg"/>
						<input type="text" placeholder="*Last Name" name="last_name" className="form-control" ref="last_name" autoComplete="off"/>
						<div className="space10"></div>
					</div>

					<div className="col-md-6">
						<img src="images/title.svg"/>
						<input type="text" placeholder="Job Title" name="title" className="form-control" ref="title" autoComplete="off"/>
						<div className="space10"></div>
					</div>
					<div className="col-md-6">
						<img src="images/org.svg"/>
						<input type="text" placeholder="*Organization" name="organization" className="form-control" ref="organization" autoComplete="off"/>
						<div className="space10"></div>
					</div>

				<div className="col-md-12">
					<div className="form-group">
						<img src="images/tel.svg"/>
						<input type="text" placeholder="*Phone" name="phone" className="form-control" ref="phone" autoComplete="off"/>
						<div className="space10"></div>
					</div>
				</div>
				<div className="col-md-12">
					<div className="form-group">
						What will you be using Mattermark for?
						<div className="space10"></div>
						<select name="usage" ref="usage">
							<option value=""></option>
							<option value="Option 1">Option 1</option>
							<option value="Option 2">Option 2</option>
							<option value="Option 3">Option 3</option>
						</select>
					</div>
				</div>
				<div className="col-md-12">
					<div className="center">
						<div className="subtitle">
							Choose Your Login Information
						</div>
					</div>
				</div>
				<div className="col-md-12">
					<div className="form-group">
						<img src="images/email.svg"/>
						<input type="email" placeholder="*Email Address" name="email" ref="email" autoComplete="off"/>
						<div className="space10"></div>
					</div>
				</div>

					<div className="col-md-6">
						<img src="images/org.svg"/>
						<input type="password" placeholder="*Create Password" name="create_password" ref="create_password" autoComplete="off"/>
						<div className="space10"></div>
					</div>
					<div className="col-md-6">
						<img src="images/org.svg"/>
						<input type="password" placeholder="*Confirm Password" name="confirm_password" ref="confirm_password" autoComplete="off"/>
						<div className="space10"></div>
					</div>

				<div className="col-md-12">
					<div className="center">
						<div className="tinytext">
							Passwords must have a minimum length of 8 characters and have at least one character from each of these groups: uppercase, lowercase, numbers, and symbols.
						</div>
					</div>
				</div>
				<div className="col-md-12 center">
					<a onClick={this.handleClick} className="border_white_btn border_blue_btn send_btn">Create Free Trial Account</a>
				</div>
				<div className="col-md-12">
					<div className="center">
						<div className="tinytext">
							Already have an account?&nbsp;
							<a href="/login">Login</a>
						</div>
					</div>
				</div>
			</div>;
		}
		return (
			<Layout {...this.props}>
				<div className="signup">
					<div className="grey_section">
						<div className="container">
							<div className="space20"></div>
							<div className="center">
								<div className="title underline underline_center">
									SIGN UP FOR FREE
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
			</Layout>
		);
	}
});
