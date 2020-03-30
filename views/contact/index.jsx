//css ./index.less
var React = require('react');
var axios = require('axios');
import Layout from '../layout/index.jsx';
import Canvas from '../_shared/canvas.jsx';

export default React.createClass({
	getInitialState() {
		return {
			submitted: false
		};
	},
	getContactData: function()
	{
		return {
			first_name: this.refs.first_name.value,
			second_name: this.refs.second_name.value,
			phone: this.refs.phone.value,
			organization: this.refs.organization.value,
			email: this.refs.email.value,
			title: this.refs.title.value,
			demo: this.refs.demo.checked,
			comment: this.refs.comment.value
		};
	},
	handleClick: function(contact)
	{
		var self = this;
		contact.preventDefault();

		// Submit form via axios/AJAX
		axios.post('/contact', this.getContactData())
		.then(function (response) {
			self.setState({submitted: true});
		})
		.catch(function (error) {
			//console.log(error);
		});
	},
	render : function()
	{
		var rowContent;
		if(this.state.submitted)
		{
			rowContent = <div className="row">Thank You</div>;
		}
		else
		{
			rowContent = <div className="row">
							<div className="with-icon col-xs-12 col-md-6">
								<img src="images/f_n.svg" />
								<input type="text" placeholder="First Name" name="first_name" ref="first_name" autoComplete="off" />
							</div>
							<div className="with-icon col-xs-12 col-md-6">
								<img src="images/tel.svg" />
								<input type="text" placeholder="Phone" name="phone" ref="phone" autoComplete="off" />
							</div>
							<div className="with-icon col-xs-12 col-md-6">
								<img src="images/f_n.svg" />
								<input type="text" placeholder="Last Name" name="second_name" ref="second_name" autoComplete="off" />
							</div>
							<div className="with-icon col-xs-12 col-md-6">
								<img src="images/org.svg" />
								<input type="text" placeholder="Organization" name="organization" ref="organization" autoComplete="off" />
							</div>
							<div className="with-icon col-xs-12 col-md-6">
								<img src="images/email.svg" />
								<input type="email" placeholder="Email Address" name="email" ref="email" autoComplete="off" />
							</div>
							<div className="with-icon col-xs-12 col-md-6">
								<img src="images/title.svg" />
								<input type="text" placeholder="Title" name="title" ref="title" autoComplete="off" />
							</div>
							<div className="col-md-12">
								<input type="checkbox" value="demo" name="demo" id="demo" ref="demo" />
								<label htmlFor="demo"></label>
								Please contact me to schedule a demo?
							</div>
							<div className="col-md-12">
								<textarea placeholder="Comment" name="comment" ref="comment"></textarea>
							</div>
							<div className="col-md-12 center">
								<a onClick={this.handleClick} className="border_white_btn border_blue_btn send_btn">SEND</a>
							</div>
						</div>;
		}

		return (
			<Layout {...this.props}>
				<div className="one_page_header contact_page_header">
					<div className="container">
						<div className="mini_info_block center mini_info_block_whithout_btn">
							<p>WE WOULD LOVE TO HEAR FROM YOU!</p>
							<p>Please Contact Us Using The Form Below.</p>
						</div>
					</div>
					<div className="citata">
						<div className="container">
							METÍSIMO PROVIDES DATA ANALYTICS ON MEDICAL DEVICES<br />
							SHOWCASE THE MEANINGFUL IMPACT ON HEALTH.
						</div>
					</div>
				</div>
				<div className="contact">
					<div id="movie" className="row">
						<Canvas src='/movies/contactus.mov'/>
					</div>
					<div className="container" ref="divContainer">
						<div className="space40"></div>
						<div className="center">
							<p className="title underline underline_center">
								CONTACT US
							</p>
						</div>
						<div className="space60"></div>
						{rowContent}
						<div className="center">
							<div className="contact-info">
								<a href="mailto:info@metisimo.com">info@metisimo.com</a>
								<a href="tel:1800-989-2343">1800-989-2343</a>
							</div>
						</div>
						<div className="space60"></div>
					</div>
				</div>
			</Layout>
		);
	}
});
