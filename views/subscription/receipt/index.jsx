import React from 'react';
import Layout from '../../layout/index.jsx';

export default React.createClass({
	render: function() {
		return (
			<Layout {...this.props}>
				<div className="container center">
					<h1>Receipt</h1>
					<p>Coming Soon</p>
				</div>
			</Layout>
		);
	}
});
