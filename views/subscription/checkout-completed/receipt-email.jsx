import React from 'react';
export default React.createClass({
	render () {
		return (
			<div className="completed-payment-section">
				<h1>Receipt</h1>
				<p>
					You have successfully completed your payment! Thank you for purchasing the
					{this.props.planName}
					This is your receipt. Please save and/or print this page for your records.
				</p>
				<p>
					If you have any questions about the reports, please contact Tony Zordich at <a href="mailto:tony@healthybeeps.com">tony@healthybeeps.com</a>.
				</p>
				<p>Total: ${this.props.price}</p>
				<p>Reference Number : {this.props.reference}</p>
			</div>
		);
	}
});