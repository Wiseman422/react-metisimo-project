import _ from 'lodash';
import { User } from 'met-data';
import logger from 'better-console';
import createError from 'http-errors';
import isEmail from '../validators/email';
import bcrypt from 'bcryptjs';

const	SALT_WORK_FACTOR = 10;            // TODO: Better moved to a config file

var ACCOUNT_PUBLIC_FIELDS = ['firstname', 'lastname', 'phone', 'organization', 'email', 'title'];

export default [
	{
		routes: ['GET /account'],
		callback: function (req, res) {

			if (!req.authenticatedUserObj) {
				return {
					redirect: '/login'
				};
			}

			return {
				view: 'account/index.jsx',
				props: {
					accountInfo: _.pick(req.authenticatedUserObj, ACCOUNT_PUBLIC_FIELDS)
				}
			};
		}

	},
	{
		routes: ['PUT /account'],              // Edit account
		callback: function (req, res, next) {

			if (!req.authenticatedUserObj) {
				return {
					redirect: '/login'
				};
			}

			if (!req.body.firstname
				|| !req.body.lastname
				|| !req.body.phone
				|| !req.body.organization
				|| !req.body.email
				|| !isEmail(req.body.email)
				|| !req.body.title
			) {
				return {
					statusCode: 400,
					json: {
						message: 'Fields can\'t be blank'
					}
				};
			}

			// Check if the updating email already exists
			return User
			.query((coll) => coll.find({ email: req.body.email }).limit(1))
			.then(function (response) {
				if (response.count === 0 || response.data[0].email === req.authenticatedUserObj.email) {

					var formBody = {
						firstname: req.body.firstname,
						lastname: req.body.lastname,
						phone: req.body.phone,
						organization: req.body.organization,
						email: req.body.email,
						title: req.body.title,
						usage: req.body.usage
					};

					Object.assign(req.authenticatedUserObj, formBody);

					return req.authenticatedUserObj
						.save()
						.then(function () {
							logger.log('/users update complete.');

							// TODO: Upon successfull update, update the session to keep the user logged index
							req.session.email = req.body.email;

							return {
								statusCode: 200,    // updated
								json: {
									message: 'Account information updated successfully.'
								}
							};
						})
						.catch(function (err) {
							next(new createError.InternalServerError('Something bad happened.'));
							return;
						});
				} else {
					return {
						statusCode: 400,
						json: {
							message: 'The email has already been registered. Please try a different email address.'
						}
					};
				}
			});
		}

	},
	{
		routes: ['POST /changePassword'],
		callback: function (req, res, next) {

			if (!req.authenticatedUserObj) {
				return {
					redirect: '/login'
				};
			}

			if (!req.body.password) {
				return {
					statusCode: 400,
					json: {
						message: 'The password fields can\'t be blank'
					}
				};
			}

			// hash the new password
			var salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
			var passwordHash = bcrypt.hashSync(req.body.password, salt);

			Object.assign(req.authenticatedUserObj, { password: passwordHash, salt });

			return req.authenticatedUserObj
				.save()
				.then(function () {
					logger.log('/users update complete.');

					// TODO: Upon successfull update, update the session to keep the user logged index
					req.session.email = req.authenticatedUserObj.email;

					return {
						statusCode: 200,    // updated
						json: {
							message: 'Account information updated successfully.'
						}
					};
				})
				.catch(function (err) {
					next(new createError.InternalServerError('Something bad happened.'));
					return;
				});
		}
	}
];
