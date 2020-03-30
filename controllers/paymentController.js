import _ from 'lodash';
import email from '../helpers/email';
import { SubscriptionPlan, SubscriptionCustomer, SubscriptionItem } from 'met-data';
import Promise from 'bluebird';
import logger from 'better-console';
import moment from 'moment';
import randomstring from 'randomstring';
import emailValidator from '../validators/email';
import stripe from '../helpers/stripe';

const validate = (req, res, next) => {
	if (req.body.terms !== 'on') {
		req.validateError = 'Please agree with the terms and conditions.';

		return next();
	}

	// Request Body validation
	if (!req.body.email
		|| !emailValidator(req.body.email)
		|| !req.body.cardNumber
		|| !req.body.expMonth
		|| !req.body.expYear
		|| !req.body.cvcNumber
		|| !req.body.name
		|| !req.body.zipCode
		|| !req.body.customerType
	) {
		req.validateError = 'Invalid input.';

		return next();
	}

	const {subscriptionPlanId} = req.body;

	// Check for duplicate email
	SubscriptionCustomer
		.query((coll) => coll.find({email: req.body.email}).limit(1))
		.then(subscriptionCustomer => {
			if (subscriptionCustomer.count > 0) {
				return Promise.reject(new Error('Email already subscribed.'));
			}
			return true;
		})
		.then(() => SubscriptionPlan.findByStripePlanId(subscriptionPlanId))
		.then(subscriptionPlan => {
			if (!subscriptionPlan) {
				return Promise.reject(new Error(`Subscription plan "${subscriptionPlanId}" is not registered`));
			}
			req.subscriptionPlan = subscriptionPlan;
			next();
		})
		.catch(e => {
			req.validateError = e.message;
			next();
		});
};

export default [
	{
		routes: ['GET /checkout/:subscriptionPlanId'],
		callback : function(req, res, next) {
			if (!req.authenticatedUserObj) { // check login
				return {
					redirect: `/login?redirect=${req.originalUrl}`
				};
			}

			var subscriptionPlanId = req.params.subscriptionPlanId;
			return SubscriptionPlan
				.findByStripePlanId(subscriptionPlanId)
				.then(function (subscriptionPlan) {
					if (!subscriptionPlan) {
						next();
						return;
					}

					return {
						view: 'subscription/checkout/index.jsx',
						props: {
							subscriptionPlan: subscriptionPlan
						}
					};
				});
		}
	},
	{
		routes: ['POST /checkout'],
		callback: [validate, function(req, res, next) {
			if (!req.authenticatedUserObj) {
				return {
					statusCode: 401,
					json: {
						message: 'Authentication is required'
					}
				};
			} else if (req.validateError) {
				return {
					statusCode: 400,
					json: {
						message: req.validateError
					}
				};
			}

			const subscriptionPlanId = req.body.subscriptionPlanId;
			const card = {
				number: req.body.cardNumber,
				exp_month: req.body.expMonth,
				exp_year: req.body.expYear,
				cvc: req.body.cvcNumber,
				name: req.body.name,
				address_zip: req.body.zipCode
			};
			const customer = {
				email: req.body.email,
				customerType: req.body.customerType
			};

			return stripe.doSubscribe(subscriptionPlanId, customer, card)
				.then(({ stripeToken, stripeCustomer, stripeSubscription}) => {
					req.stripeSubscription = stripeSubscription;
					const customerinfo = _.pick(req.body, ['email', 'name', 'zipCode', 'customerType']);

					return new SubscriptionCustomer({
						...customerinfo,
						currentSubscribedPlanId: req.subscriptionPlan._id,
						stripeCustomer,
						stripeToken,
						stripeCardLast4Digits: stripeToken && stripeToken.card ? stripeToken.card.last4 : '',
						userId: req.authenticatedUserObj._id,
						createdAt: new Date()
					})
					.save();
				})
				.then(subscriptionCustomer => {
					var suffix = randomstring.generate({
						length: 10,
						charset: 'alphanumeric',
						capitalization: 'lowercase'
					});
					var prefix = moment().format('YYYYMMDD');
					req.reference = prefix + suffix;

					// TODO
					var subscriptionStatus = SubscriptionItem.STATUS_SUBSCRIPTION_ACTIVE;

					return new SubscriptionItem({
						subscriptionPlanId: req.subscriptionPlan._id,
						subscriptionCustomerId: subscriptionCustomer._id,
						reference: req.reference,
						subscriptionStatus,
						subscriptionCreatedAt: new Date(),        // TODO
						subscriptionLastUpdatedAt: new Date(),
						subscriptionHistory: [
							{
								eventType: SubscriptionPlan.EVENT_SUBSCRIPTION_CREATED,
								eventDetails: {
									reference: req.reference,
									timestamp: new Date()
								}
							}
						],
						stripeSubscription: req.stripeSubscription
					})
					.save();
				})
				.then(function (subscriptionItem) {
					email({
						from: 'miguel+jameslin@metisimo.com',
						to: req.body.email,
						subject: 'Thank you for your purchase!',
						props: {
							name: req.body.name,
							email: req.body.email,
							price: req.subscriptionPlan.price,
							planName: subscriptionPlanId,
							reference: req.reference
						}
					}, 'subscription/checkout-completed/receipt-email.jsx', req);

					email({
						from: 'miguel+jameslin@metisimo.com',
						to: 'miguel+jameslin@metisimo.com',
						subject: 'Order made',
						props: {
							name: req.body.name,
							email: req.body.email,
							zipCode: req.body.zipCode,
							customerType: req.body.customerType,
							planName: subscriptionPlanId,
							reference: req.reference
						}
					}, 'subscription/checkout-completed/admin-email.jsx', req);

					return {
						statusCode: 200,
						json: {
							message: 'OK',
							redirect: '/checkout-complete/' + req.reference
						}
					};
				})
				.catch(function (err) {
					logger.log('%%%%%%%%%%%%% error while customer subscribing', err);

					return {
						statusCode: 500,
						json: {
							message: 'Internal Server Error, please contact admin.'
						}
					};
				});
		}]
	},
	{
		routes: ['GET /checkout-complete/:reference'],
		callback: function(req, res, next) {
			var reference = req.params.reference;

			return SubscriptionItem
				.findByReference(reference)
				.then(function (subscriptionItem) {
					if (subscriptionItem) {
						return Promise.join(
							subscriptionItem.getSubscriptionPlan(),
							subscriptionItem.getSubscriptionCustomer()
						).spread(function (subscriptionPlan, subscriptionCustomer) {
							return {
								view: 'subscription/checkout-completed/index.jsx',
								props: {
									to: subscriptionCustomer.name,
									email: subscriptionCustomer.email,
									subscriptionPlan: subscriptionPlan,
									reference: reference
								}
							};
						});
					} else {
						// 404
						next();
						return;
					}
				});
		}
	}
];
