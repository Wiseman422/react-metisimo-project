//css ./index.less
import React from 'react';
import Layout from '../../layout/index.jsx';

export default React.createClass({

	render: function() {
		const { currentSubscribedPlanId } = this.props;
		var subscriptions = this.props.subscriptions.data;

		var subscriptionTiersRendered = subscriptions.map((tier, idx) => {
			const subscribed = currentSubscribedPlanId === tier._id;

			return (
				<div className="col-md-6 center" key={idx}>
					<p>
						<strong>{tier.displayName}</strong>
						{subscribed && <span>&nbsp;(Already subscribed)</span>}
					</p>
					<p dangerouslySetInnerHTML={{__html: tier.description}}>
					</p>
					<p dangerouslySetInnerHTML={{__html: tier.longDescription}}>
					</p>
					{
						tier.trialPeriodDays
							? <p>Trial Period: {tier.trialPeriodDays} Days</p>
							: ''
					}
					{subscribed && <a className="border_white_btn" href={'/receipt'}>RECEIPT</a>}
					{subscribed || <a className="border_white_btn" href={'/checkout/' + tier.stripePlanId}>SUBSCRIBE</a>}
				</div>
			);
		});

		return (
			<Layout {...this.props}>
				<div id="pricing-container" className="container center">
					<div id="pricing" className="container">
							<h2>Pricing</h2>

							<div className="blocks row">
								{subscriptionTiersRendered}

								<div className="col-md-6 center">
									<p>
										<strong>Enterprise</strong>
									</p>
									<p>
										For those that are looking for customized reports and assistance
									</p>
									<ul>
										<li>Custom packages and access for teams</li>
										<li>Customized reports built for the needs of the organization</li>
										<li>Consulting services around strategy, operations and technology</li>
									</ul>
									<a className="border_white_btn" href="/contact">CONTACT US</a>
								</div>
							</div>
					</div>
				</div>
			</Layout>
		);
	}
});
