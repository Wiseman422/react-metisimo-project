var React = require('react');

module.exports = React.createClass({

	render: function() {
		return (
			<p>Please click this <a href={this.props.verificationUrl}>link</a> to reset your password.</p>
		);
	}
});
