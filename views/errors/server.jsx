import React from 'react';

export default React.createClass({
	render() {
		return (
		<div className="row" style={{margin: '50px 0'}}>
			<div className="col-sm-offset-2 col-sm-4 col-xs-12 text-center">
				<img src={'/public/images/' + this.props.imglink + '.svg'} />
			</div>
			<div className="col-sm-4 col-xs-12">
				<h1>Uh oh<br/><small>{this.props.errMsg}</small></h1>
				<h2><small>Error {this.props.errCode}</small></h2>
				<p>{this.props.suggestion}</p>
			</div>
		</div>
		);
	}
});
