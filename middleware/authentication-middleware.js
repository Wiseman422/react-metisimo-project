import { User, SubscriptionCustomer } from 'met-data';
import createError from 'http-errors';

export default function authenticationMiddleware (req, res, next) {
	const { email } = req.session;
	req.authenticatedUserObj = null;

	if (!email) { return next(); }

	User
	.query((coll) => coll.find({email}).limit(1))
	.then(resp => {
		if (resp.count === 1) {
			req.authenticatedUserObj = resp.data[0];
			return true;
		}

		return false;
	})
	.then(loggedIn => {
		if (!loggedIn) {
			return next();
		}

		return SubscriptionCustomer
			.query((coll) => coll.find({userId: req.authenticatedUserObj._id}).limit(1))
			.then((resp) => {
				if (resp.count > 0) {
					req.authenticatedUserObj.subscriptionCustomer = resp.data[0];
				}
				return next();
			});
	})
	.catch(function(err) {
		next(new createError.InternaalServerError('Error occurred while validating the session.'));
	});
}
