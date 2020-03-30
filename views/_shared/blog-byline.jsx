import React from 'react';
import classnames from 'classnames';

export default React.createClass({
	render() {
		var date = new Date(this.props.postedDate);
		var year  = date.getFullYear();
		var day  = date.getDate();
		var month  = date.getMonth() + 1;
		return <div className={classnames("blog-byline",this.props.className)}>
			<div>
				By <a className="blog-author" href={'/blog/author/' + encodeURIComponent(this.props.author_search) }>{this.props.author}</a>
			</div>
			<div className="blog-date">{month}/{day}/{year}</div>
		</div>;
	}
});