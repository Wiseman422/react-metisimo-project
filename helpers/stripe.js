import Stripe from 'stripe';
import config from '../config';

const stripe = Stripe(config('stripe.secretKey'));

const doSubscribe = (plan, customer, card) => {
	let stripeToken, stripeCustomer;

	return stripe.tokens
		.create({ card })
		.then(sToken => {
			const metadata = {
				...customer,
				subscribedPlan: plan,
				zipCode: card.address_zip
			};
			stripeToken = sToken;

			return stripe.customers.create({
				email: customer.email,
				source: sToken.id,
				description: `${customer.email} ${customer.customerType}`,
				metadata
			});
		})
		.then(sCustomer => {
			stripeCustomer = sCustomer;

			return stripe.subscriptions.create({
				customer: sCustomer.id,
				plan
			});
		})
		.then(stripeSubscription => ({
			stripeToken,
			stripeCustomer,
			stripeSubscription
		}));
};

export default {
	registerCard: stripe.tokens,
	registerCustomer: function(email, cardToken, description, metadata) {
		return stripe.customers.create({
			email,
			source: cardToken,
			description,
			metadata
		});
	},
	createSubscription: function(customerId, subscriptionPlanId) {
		return stripe.subscriptions.create({
			customer: customerId,
			plan: subscriptionPlanId
		});
	},
	doSubscribe
};
