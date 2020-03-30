//css ./error-404.less
import React from 'react';

export default React.createClass({
	render() {
		return (
		<div id="error-404" className="row">
			<div className="col-sm-offset-2 col-sm-4 col-xs-12 text-center">
				<img src="/public/images/deadend.svg" />
			</div>
			<div className="col-sm-4 col-xs-12">
				<h1>Ooops<br/><small>That Page Doesn't Exist</small></h1>
				<h2><small>Error 404</small></h2>
				<p>Try one of the links below.</p>
			</div>
		</div>
		);
	}
});
