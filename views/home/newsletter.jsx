//css ./newsletter.less
import React from 'react';

export default React.createClass({
	render : function(){
		return (
			<div id="newsletter">
				<div className="container">
					<h2>Join Our Newsletter</h2> 
					<input type="text"  placeholder="Enter your email address"/>
					<a href="/metisimo/#">Submit</a>
				</div>
			</div>
		);
	}
});
