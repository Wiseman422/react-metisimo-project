//css ./checkout-completed.less

import React from 'react';
import Layout from '../../layout/index.jsx';

export default React.createClass({
	render () {
		return (
      <Layout {...this.props}>
          <div className="container" id="checkout-completed-container">
              <h1>Payment Completed</h1>
              <p>Thank you for your order, {this.props.to}!</p>
              <p>Your report will be sent to your email address, {this.props.email}, within 24 hours.</p>
              <p>Reference Number : {this.props.reference}</p>
          </div>
      </Layout>
		);
	}
});
