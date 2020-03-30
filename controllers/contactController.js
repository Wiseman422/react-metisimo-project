import email from '../helpers/email';

export default [
	{
		routes : ['GET /contact', 'GET /contact-us'],
		callback : function(req, res){
			return {
				view : 'contact/index.jsx',
			};
		}
	},
	{
		routes: ['POST /contact'],
		callback: function(req, res) {
			//console.log(req.body);
			// email ({
			// 	from: req.body.email,
			// 	to: 'hello@healthybeeps.com',
			// 	subject: 'Thank you for your comments',
			// 	props: {name: req.body.name, email: req.body.email, message: req.body.comment}
			// }, 'contact-complete/index.jsx', req);
			
			return { statusCode: 200, json: { message: 'Thank You'} };
		}
	}
];