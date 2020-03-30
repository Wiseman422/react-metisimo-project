var React = require('react');

module.exports = React.createClass({

	render: function() {
		return (
			<div>
				<h1>Order Placed</h1>
				<p>Reference Number: {this.props.reference}</p>
				<p>{this.props.name}</p>
				<p>{this.props.email}</p>
				<p>{this.props.zipCode}</p>
				<p>{this.props.customerType}</p>
				<p>{this.props.planName}</p>
			</div>
		);
	}

});

