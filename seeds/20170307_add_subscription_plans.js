


var SubscriptionPlan = require('met-data').SubscriptionPlan;

// exports a promise
module.exports = SubscriptionPlan.findByStripePlanId('basic-monthly')
	.then(function (subscription) {
		if (!subscription) {
			return new SubscriptionPlan({
				"stripePlanId" : "basic-monthly",
				"displayName" : "Individual",
				"description" : "For those that are looking for quick easy queries about medical devices",
				"longDescription" : "<ul><li>Millions of medical device company profiles</li><li>Scores of medical device performance</li><li>Saved Searches, Custom List & Alerts</li></ul>",
				"price" : "100",
				"recurringInterval" : "PAYMENT_RECURRING_INTERVAL_MONTHLY",
				"trialPeriodDays" : 30.0,
				"enabled" : true
			})
			.save()
			.then(() => console.log("Seed file saved successfully"))
			.catch(() => console.log("An error occurred while applying the seed file."));
		} else {
			console.log("SubscriptionPlan with similar planId already exists.");
		}
	});
