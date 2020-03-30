import React from 'react';
import classnames from 'classnames';

export default React.createClass({
	render() {
		// TODO get base URL from server side node
		var link = global.document ? global.document.baseUri : null;
		var title = this.props.title;
		var tags = this.props.tags;
		return <div className={classnames('share-buttons',this.props.className)}>
			<div>Share:</div>
			<a href={'http://www.facebook.com/sharer.php?u=' + link} target="_blank">
				<img src="/public/images/share/facebook.png" alt="Facebook" />
			</a>
			<a href={'https://plus.google.com/share?url=' + link} target="_blank">
				<img src="/public/images/share/google.png" alt="Google" />
			</a>
			<a href={'http://www.linkedin.com/shareArticle?mini=true&amp;url=' + link} target="_blank">
				<img src="/public/images/share/linkedin.png" alt="LinkedIn" />
			</a>
			<a href={'http://reddit.com/submit?url=' + link + '&amp;title=' + title} target="_blank">
				<img src="/public/images/share/reddit.png" alt="Reddit" />
			</a>
			<a href={'https://twitter.com/share?url=' + link + ';text=' + title + ';hashtags=' + tags} target="_blank">
				<img src="/public/images/share/twitter.png" alt="Twitter" />
			</a>
		</div>;
	}
});