import React from 'react';
import _ from 'lodash';
import BlogByline from '../../_shared/blog-byline.jsx';

export default React.createClass({
	render: function() {
		return (
			<div id="blog-list-container" className="container">
				<h1>Blog</h1>
				{_.map(this.props.list, function(result, index){
					return <div className="blog-summary col-xs-12" key={index}>
						<h2><a href={'/blog/' + result.id}>{result.title}</a></h2>
						<BlogByline {...result} />
						<p>{result.blurb}</p>
					</div>;
				})}
			</div>
		);
	}
});

