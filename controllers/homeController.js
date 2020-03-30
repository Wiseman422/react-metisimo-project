import Bluebird from 'bluebird';
import config from '../config';
import _ from 'lodash';
import { SubscriptionPlan } from 'met-data';

export default [
	{
		routes : '/',
		callback : {
			view  : 'home/index.jsx'
		}
	},
	{
		routes : '/about',
		callback : {
			view  : 'about/index.jsx'
		}
	},
	{
		routes : '/products',
		callback : {
			view  : 'products/index.jsx'
		}
	},
	{
		routes: ['GET /pricing', 'GET /subscriptions'],
		callback: function (req, res, next) {
			const currentSubscribedPlanId = req.authenticatedUserObj
				&& req.authenticatedUserObj.subscriptionCustomer
				&& req.authenticatedUserObj.subscriptionCustomer.currentSubscribedPlanId;

			return SubscriptionPlan
				.query((coll) => coll.find({}))
				.then(function (subscriptions) {
					return {
						view: 'subscription/pricing/index.jsx',
						props: {
							subscriptions, currentSubscribedPlanId
						}
					};
				});
		}
	},
	{
		routes : '/receipt',
		callback : {
			view  : 'subscription/receipt/index.jsx'
		}
	},
	{
		routes : '/throw',
		callback : function() {
			throw new Error("intentonal error");
		}
	}
];
