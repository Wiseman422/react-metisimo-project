//css ./blog.less
import React from 'react';

export default React.createClass({
	render : function(){
		return (
			<div id="blog">
				<h2>Blog</h2>
				<p>
					Check in with our blog to see our perspective about medical devices and the impact that its having on people's lives today.
				</p>
				<a className="button" href="">LEARN MORE</a>
			</div>
		);
	}
});
