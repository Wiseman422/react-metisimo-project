//css ./index.less
var React = require('react');
var axios = require('axios');
var validator = require('validator');
import Layout from '../../layout/index.jsx';

export default React.createClass({

	render() {
		var rowContent;

		if (this.props.hasError) {
			rowContent = (
				<div className="row">
					<div className="col-md-12">
						<div className="center">
							<div className="tinytext">
								{this.props.flashMessage}
							</div>
						</div>
					</div>
				</div>
			);
		} else {
			rowContent = (
				<div className="row">
					<div className="col-md-12">
						<div className="center">
							<div className="tinytext">
								{this.props.flashMessage}
							</div>
						</div>
					</div>
				</div>
			);
		}


		return (
			<Layout {...this.props}>
				<div className="signup">
					<div className="container">
						<div className="space30"></div>
						<div className="space20"></div>
						<div className="justify">
							{rowContent}
						</div>
						<div className="space30"></div>
					</div>
				</div>
			</Layout>
		);
	}
});
