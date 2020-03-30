//css ./checkout.less
import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import axios from 'axios';
import {ValidationMixin} from '../../_shared/validation-mixin.jsx';
import Layout from '../../layout/index.jsx';


function expirationValidation(value,component) {
	var month = ReactDOM.findDOMNode(component.refs.expMonth).value;
	var year = ReactDOM.findDOMNode(component.refs.expYear).value;
	var then = new Date(year,month,1);
	var now = new Date();
	return now <= then;
}

export default React.createClass({
	mixins : [ValidationMixin],
	validations : {
		name : ['required'],
		email : ['required', 'email'],
		customerType : ['required'],
		cardNumber : ['required','creditCard'],
		cvcNumber : ['required'],
		expMonth : ['required',expirationValidation],
		expYear : ['required',expirationValidation],
		zipCode : ['required'],
		terms : ['checked']
	},

	getInitialState: function() {
		return {
			hasError: false,
			errMsg: '',
			isSubmitting: false
		};
	},

	changeHandler : function (evt) {
		var tgtId = evt.target.id;
		var val = evt.target.value;
		var updt = {};
		updt[tgtId] = val;
		this.setState(updt);
	},

	setCardNo : function(cno) {
		this.setState({cardNumber : cno});
	},

	onSubmit : function(evt) {
		var self = this;

		evt.stopPropagation();
		evt.preventDefault();

		this.setState({
			hasError: false,
			errMsg: '',
			isSubmitting: true
		});

		this.validate().then(function(results){

			if(results.isValid) {
				results.values.subscriptionPlanId = self.props.subscriptionPlan.stripePlanId;

				return axios.post(
					'/checkout',
					results.values,
					{headers : {'Content-Type' : 'application/json'}}
				).then(function(response){
					if (response.data.message === 'OK') {
						self.setState({
							errMsg   : '',
							hasError : false,
							isSubmitting: false
						});
						window.location.assign(response.data.redirect);
					} else {
						self.setState({
							errMsg   : response.data.message,
							hasError : true,
							isSubmitting: false
						});
					}
				}).catch(function (response) {
					self.setState({
						errMsg   : response.data.message,
						hasError : true,
						isSubmitting: false
					});
				});
			} else {
				self.setState({
					isSubmitting: false
				});
			}
		});
	},

	render: function() {

		var years = _.range(new Date().getFullYear(), new Date().getFullYear()+20);
		var product = this.props.subscriptionPlan;
		var validations = _.filter(_.get(this.state,'validations',[]), (item) => !item.isValid);
		const loggedUser = this.props.authenticatedUserObj;

		return (
			<Layout {...this.props}>
				<div id="checkout-container" className="container">
					<div className="checkout-section" id="card-wrapper">
						<form id="payment-form" onSubmit={this.onSubmit} noValidate>
							<h2 id="product">
								Checkout
							</h2>
							<div>
								<ul className="validation-summary">
									{_.map(validations, (item,index) => <li key={index}>{item.message}</li>)}
								</ul>
								<ul className="error">
									{ this.state.hasError ? <li>{this.state.errMsg}</li> : ''}
								</ul>
								<div className="form-field">
									<b>{product.displayName}</b>&nbsp; - &nbsp;
									<b>${product.price}.00</b>
								</div>
								<div className="form-field">
									<label htmlFor="name" className="form-name">Name on Card</label>
									<input
										type="text"
										name="name"
										ref="name"
										id="name"
										required
										className={this.validationClassName('name')}
										placeholder="Name on Card"
										data-message="Please enter the name on the credit card."
										value={loggedUser.firstname + ' ' + loggedUser.lastname}
									/>
								</div>
								<div className="form-field">
									<label htmlFor="email" className="form-name">Email</label>
									<input
										id="email"
										type="email"
										name="email"
										ref="email"
										placeholder="Email Address"
										className={this.validationClassName('email')}
										data-message="Please enter a valid email address."
										value={loggedUser.email}
									/>
								</div>
								<div className="form-field">
									<label htmlFor="customerType" className="form-name">I am a _____.</label>
									<select
										className=""
										id="customerType"
										name="customerType"
										ref="customerType">
											<option value="patient">Patient</option>
											<option value="cargiver">Caregiver</option>
											<option value="medical-practioner">Medical Practioner</option>
											<option value="pharma-company">Pharma Company</option>
											<option value="medical-device-company">Medical Device Company</option>
											<option value="other">Other</option>
									</select>
								</div>
								<div className="form-field">
									<label htmlFor="cardNumber" className="form-name" id="card-label-text">Card Number</label>
									<input
										type="text"
										name="cardNumber"
										ref="cardNumber"
										className=""
										id="cardNumber"
										placeholder="xxxx xxxx xxxx xxxx"
										className={this.validationClassName('cardNumber')}
										data-message="Please enter a valid credit card."/>
								</div>
								<div className="form-field">
									<label htmlFor="cvcNumber" className="form-name">CVC</label>
									<input
										type="text"
										name="cvcNumber"
										ref="cvcNumber"
										placeholder="CVC code"
										className=""
										id="cvcNumber"
										className={this.validationClassName('cvcNumber')}
										data-message="Please enter a cvc."
									/>
								</div>
								<div className="form-field">
									<label className="form-name">Expiration</label> &nbsp;
									<select
										name="expMonth"
										ref="expMonth"
										className=""
										id="expMonth"
										className={this.validationClassName('expMonth')}
										data-message="Please enter a valid expiration month.">
											<option value="">Expiration Month</option>
											<option value="1">January</option>
											<option value="2">February</option>
											<option value="3">March</option>
											<option value="4">April</option>
											<option value="5">May</option>
											<option value="6">June</option>
											<option value="7">July</option>
											<option value="8">August</option>
											<option value="9">September</option>
											<option value="10">October</option>
											<option value="11">November</option>
											<option value="12">December</option>
									</select> &nbsp;
									<select
										name="expYear"
										ref="expYear"
										id="expYear"
										id="expYear"
										className=""
										className={this.validationClassName('expYear')}
										data-message="Please enter a valid expiration year.">
										<option value="">Expiration Year</option>
										{_.map(years, (year) => (<option key={year} value={year}>{year}</option>))}
									</select>
								</div>
								<div className="form-field">
									<label htmlFor="zipCode" className="form-name">Zip Code</label>
									<input
										id="zipCode"
										name="zipCode"
										ref="zipCode"
										type="text"
										className=""
										maxLength="5"
										className={this.validationClassName('zipCode')}
										data-message="Please enter a valid zip code"
									/>
								</div>
							</div>
							<div className="tos-agreement">
								<input
									type="checkbox"
									name="terms"
									id="terms"
									ref="terms"
									className={this.validationClassName('terms')}
									/>
								<label htmlFor="terms"></label>
									<a href="/terms-of-use" target="tos">Terms of use</a>.
									No part of this report may be reproduced, distributed, altered,
									transmitted, displayed, published, or broadcast without the prior,
									express written approval of Healthy Beeps Inc.
							</div>
							<button type="submit" className="green-button submitPayment button-blue" id="checkout-btn" disabled={this.state.isSubmitting}>Submit Payment</button>
						</form>
					</div>
				</div>
			</Layout>
		);
	}
});
