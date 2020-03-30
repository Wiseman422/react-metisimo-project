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
			responseErrMsg: ''
		};
	},
	getLoginData: function () {
		return {
			email: this.refs.email.value,
			password: this.refs.password.value
		};
	},
	handleClick: function (login) {
		login.preventDefault();
		var data = this.getLoginData();

		validator.reset();

		validator.email('Invalid Email', this.refs.email.value);
		validator.required('Password is required', this.refs.password.value);

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
		axios.post('/login', data)
			.then(response => {
				if (response.status === 200) {
					this.setState({
						responseError: false
					});
					window.location.href = '/account';
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

		rowContent = <div className="row">
						<div className="col-md-12">
							<img src="images/email.svg" />
							<input type="email" placeholder="Email Address" name="email" ref="email" autoComplete="off" />
							<div className="space10"></div>
						</div>
						<div className="col-md-12">
							<img src="images/org.svg" />
							<input type="password" placeholder="Password" name="password" ref="password" autoComplete="off" />
							<div className="space10"></div>
						</div>
						<div className="col-md-12 center">
							<a onClick={this.handleClick} className="border_white_btn border_blue_btn send_btn">Login</a>
						</div>
						<div className="center">
							<div className="tinytext">
								Not a subscriber? <a href="/signup">Sign Up</a>
							</div>
						</div>
						<div className="center">
							<div className="tinytext">
								Forgot your password? <a href="/forgot_password">Reset password</a>
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
