import React from 'react';
import Share from '../shared/share.jsx';
import BlogByline from '../shared/blog-byline.jsx';

module.exports = React.createClass({
	render: function() {
		return (
			<div id="blog-container" className="container">
				<h1 className="blog-title">{this.props.title}</h1>
				<BlogByline {...this.props} className="col-sm-6"/>
				<Share title={this.props.title} className="col-sm-6"/>
				<div className="blog-content">
					{ this.props.image ? <img className="blog-image col-xs-12 col-sm-6 col-md-5 col-lg-4" src={this.props.image}/> : null}
					{ this.props.subtitle ? <h2 className="blog-subtitle">{this.props.subtitle}</h2> : null}
					<div dangerouslySetInnerHTML={{__html: this.props.article}} ></div>
				</div>
			</div>
		);
	}
});

