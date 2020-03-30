import _ from 'lodash';
import logger from 'better-console';
import createError from 'http-errors';
import Promise from 'bluebird';
import uuid from 'uuid';
import bcrypt from 'bcryptjs';
import { User } from 'met-data';
import email from '../helpers/email';
import emailValidator from '../validators/email';

const SALT_WORK_FACTOR = 10;            // TODO: Better moved to a config file

const validateVerifyCode = (req, res, next) => {
	const { emailVerificationCode } = req.params;

	return User
		.query((coll) => coll.find({ emailVerificationCode }).limit(1))
		.then(resp => {
			if (!resp.count) {
				req.invalidEmailVerificationCode = true;
			} else {
				req.emailVerifyUser = resp.data[0];
			}
			next();
		})
		.catch(e => logger.error(e));
};

const validateSignup = (req, res, next) => {
	// Request Body validation
	if (!req.body.firstname
		|| !req.body.lastname
		|| !req.body.phone
		|| !req.body.organization
		|| !req.body.email
		|| !req.body.title
		|| !req.body.usage
		|| !req.body.password
	) {
		req.validateError = 'Please enter the required fields.';
		return next();
	}

	if (!emailValidator(req.body.email)) {
		req.validateError = 'Please enter valid email address.';
		return next();
	}

	// Check for duplicate user
	User
		.query((coll) => coll.find({ email: req.body.email }).limit(1))
		.then(users => {
			if (users.count > 0) {
				return Promise.reject(new Error('The email has already been registered. Please Login.'));
			}
			return next();
		})
		.catch(e => {
			req.validateError = e.message;
			return next();
		});
};

export default [
	{
		routes: ['GET /login'],
		callback: {
			view: 'auth/login/index.jsx'
		}
	},
	{
		routes: ['GET /forgot_password'],
		callback: {
			view: 'auth/forgot-password/index.jsx',
		}
	},
	{
		routes: ['GET /reset_password/:emailVerificationCode'],
		callback: [validateVerifyCode, function (req, res) {
			if (req.invalidEmailVerificationCode) {
				return {
					view: 'auth/reset-password/index.jsx',
					props: {
						isInvalidCode: true
					}
				};
			}
			return {
				view: 'auth/reset-password/index.jsx',
				props: {
					emailVerificationCode: req.params.emailVerificationCode
				}
			};
		}]
	},
	{
		routes: ['POST /reset_password/:emailVerificationCode'],
		callback: [validateVerifyCode, function (req, res) {
			if (req.invalidEmailVerificationCode) {
				return {
					statusCode: 400,
					json: {
						message: 'Invalid email reset link.'
					}
				};
			} else if (!req.body.password) {
				return {
					statusCode: 400,
					json: {
						message: 'Please provide a password'
					}
				};
			}

			const user = req.emailVerifyUser;

			// hash the new password
			var salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
			var passwordHash = bcrypt.hashSync(req.body.password, salt);

			user.salt = salt;
			user.password = passwordHash;
			user.emailVerificationCode = null;

			return user.save()
				.then(() => ({
					statusCode: 200,
					json: {
						message: 'Password successfully reset. Please login.'
					}
				}))
				.catch(e => {
					logger.error('An error occured while reseting password', e);

					return {
						statusCode: 500,
						json: {
							message: 'An unknonwn error occurred, please check again latter.'
						}
					};
				});
		}]
	},
	{
		routes: ['POST /send_forgot_password_email'],
		callback: function (req, res) {
			if (!req.body.email) {
				return {
					statusCode: 400,
					json: {
						message: 'Please enter your email address, associated with your account.'
					}
				};
			}

			return User
				.query(coll => coll.find({ email: req.body.email }).limit(1))
				.then(response => {
					if (!response.count) {
						return {
							statusCode: 400,
							json: {
								message: 'No associated account found for the email.'
							}
						};
					}

					var userAccount = response.data[0];
					var emailVerificationCode = uuid.v4();
					userAccount.emailVerificationCode = emailVerificationCode;

					const verificationUrl = `${req.protocol}://${req.get('host')}/reset_password/${emailVerificationCode}`;
					logger.log(verificationUrl);

					return userAccount.save()
						.then(() => {
							console.log('sending email', verificationUrl);
							email({
								from: 'noreply@metisimo.com',
								to: req.body.email,
								subject: 'Metisimo Verification Code',
								props: {
									name: userAccount.firstname,
									email: userAccount.email,
									verificationUrl
								}
							}, 'auth/forgot-password/resetlink-email.jsx', req);

							return {
								statusCode: 200,
								json: {
									message: 'Please check your inbox for the password reset email.'
								}
							};
						});
				})
				.catch(function (err) {
					logger.error('Error occurred while sending forgot password email', err);
					return {
						statusCode: 500,
						json: {
							message: 'An unknown error happened, please try again latter.'
						}
					};
				});
		}
	},
	{
		routes: ['GET /logout', 'DELETE /logout', 'POST /logout'],           // TODO: Remove GET request
		callback: function (req, res) {
			req.session.email = null;

			return {
				redirect: '/'
			};
		}
	},
	{
		routes: ['POST /login'],
		callback: function (req, res, next) {
			const { email, password } = req.body;

			if (!email || !password) {
				return {
					statusCode: 400,
					json: {
						message: 'Please enter your email and password.'
					}
				};
			}

			return User
				.query((coll) => coll.find({email, enabled: true}).limit(1))
				.then(function (response) {
					if (response.count === 1) {
						var user = response.data[0];
						var hashedPassword = user.password;
						if (bcrypt.compareSync(req.body.password, hashedPassword)) {
							if (user.verified) {

								// upon successfull authentication
								req.session.email = email;
								return {
									statusCode: 200,
									json: {
										message: 'Logged in successfully.'
									}
								};
							} else {
								return {
									statusCode: 401,
									json: {
										message: 'Your account is not verified yet. Please check your inbox for a verification email.'
									}
								};
							}

						} else {
							return {
								statusCode: 401,
								json: {
									message: 'Invalid login credentials. Please check again.'
								}
							};
						}
					} else {
						return {
							statusCode: 401,
							json: {
								message: 'User not found. Please check again.'
							}
						};
					}
				})
				.catch(function (err) {
					logger.error('An error occurred while fetching user data.', err);
					next(new createError.InternalServerError('An unknown error occurred.'));
					return;
				});
		}
	},
	{
		routes: ['GET /signup'],
		callback: function (req, res) {
			return {
				view: 'auth/signup-form/index.jsx',
			};
		}
	},
	{
		routes: ['POST /signup'],
		callback: [validateSignup, function (req, res, next) {
			if (req.validateError) {
				return {
					statusCode: 400,
					json: {
						message: req.validateError
					}
				};
			}

			const emailVerificationCode = uuid.v4();
			const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
			const password = bcrypt.hashSync(req.body.password, salt);

			const item = {
				..._.pick(req.body, ['firstname', 'lastname', 'phone', 'organization', 'email', 'title', 'usage']),
				password, salt, emailVerificationCode,
				verified: false,
				enabled: true
			};

			const verificationUrl = `${req.protocol}://${req.get('host')}/activateAccount/${emailVerificationCode}`;
			email({
				from: 'noreply@metisimo.com',
				to: req.body.email,
				subject: 'Metisimo Verification Code',
				props: { verificationUrl }
			}, 'auth/signup-form/verify-email.jsx', req);

			return new User(item)
				.save()
				.then(function () {
					logger.log('/users save complete.');
					logger.log(verificationUrl);
					return {
						statusCode: 201,    // created
						json: {
							message: 'User successfully signed up. Please check your inbox for the confirmation email.'
						}
					};
				});
		}]
	},
	{
		routes: ['GET /activateAccount/:emailVerificationCode'],
		callback: function (req, res, next) {
			const { emailVerificationCode } = req.params;

			return User
				.query((coll) => coll.find({ emailVerificationCode, verified: false }).limit(1))
				.then(res => {
					if (res.count < 1) {
						return {
							view: 'auth/verification-complete/index.jsx',
							props: {
								isError: true,
								flashMessage: 'Invalid verfication code. Please verify the verification URL again.'
							}
						};
					}

					const user = res.data[0];

					user.verified = true;
					user.emailVerificationCode = null;

					return user
						.save()
						.then(() => ({
							view: 'auth/verification-complete/index.jsx',
							props: {
								isError: false,
								flashMessage: 'Congratulations! Your account is successfully verified. Please login to view your account.'
							}
						}));
				})
				.catch(err => {
					logger.error('Error occurred while verifying the user', err);

					return {
						view: 'auth/verification-complete/index.jsx',
						props: {
							isError: true,
							flashMessage: 'An error occurred. Please contact the admin.'
						}
					};
				});
		}
	}
];
