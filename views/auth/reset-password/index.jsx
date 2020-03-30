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
			validationError: false,
			validationMsg: '',
			responseError: false,
			responseErrMsg: '',
			isSubmitted: false
		};
	},
	getLoginData: function () {
		return {
			password: this.refs.password.value
		};
	},
	handleClick: function (login) {
		login.preventDefault();
		var data = this.getLoginData();

		validator.reset();
		validator.required('Password is required', this.refs.password.value);
		validator.required('Confirm Password is required', this.refs.confirm_password.value);
		validator.match('Passwords do not match', [this.refs.password.value, this.refs.confirm_password.value]);
		validator.password('Password is not strong enough', this.refs.password.value);

		if (!validator.isValid()) {
			this.setState({
				validationMsg: validator.messages().join(', '),
				validationError: true,
				responseError: false
			});

			return;
		}

		this.setState({
			validationError: false,
			isSubmitted: false
		});

		// Submit form via axios/AJAX
		axios.post('/reset_password/' + this.props.emailVerificationCode, data)
			.then(response => {
				if (response.status === 200) {
					this.setState({
						responseError: false,
						isSubmitted: true
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

		if (this.state.isSubmitted) {
			rowContent = <div className="row">
				<div className="col-md-12">
					<div className="center">
						<div className="tinytext">
							Successfully reset the password, please login.
						</div>
					</div>
				</div>
			</div>;
		} else {
			rowContent = <div className="row">
							<div className="col-md-12">
								<img src="/images/org.svg" />
								<input type="password" placeholder="Password" name="password" ref="password" autoComplete="off" />
								<div className="space10"></div>
							</div>
							<div className="col-md-12">
								<img src="/images/org.svg" />
								<input type="password" placeholder="Password Confirmation" name="confirm_password" ref="confirm_password" autoComplete="off" />
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
								<a onClick={this.handleClick} className="border_white_btn border_blue_btn send_btn">Reset</a>
							</div>
						</div>;
		}

		var invalidCodeContent = <div className="row">
									<div className="center">
										<div className="validationError">
											Invalid code. Please check the URL again.
											<div className="space10"></div>
										</div>
									</div>
								</div>;

		return (<Layout {...this.props}>
			<div className="signup">
				<div className="grey_section">
					<div className="container">
						<div className="space20"></div>
						<div className="center">
							<div className="title underline underline_center">
							RESET PASSWORD
							</div>
						</div>
						<div className="space20"></div>
					</div>
				</div>
				<div className="container">
					<div className="space30"></div>
					<div className="space20"></div>
					<div className="justify">
						{
							this.props.isInvalidCode
							? invalidCodeContent
							: (
								<div>
									{validationContent}
									{responseErrContent}
									{rowContent}
								</div>
							)
						}
					</div>
					<div className="space30"></div>
				</div>
			</div>
			</Layout>);
	}
});
