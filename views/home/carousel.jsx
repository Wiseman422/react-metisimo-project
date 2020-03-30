//css ./carousel.less
import React from 'react';


export default React.createClass({
	render : function(){
		return (
			<div id="homepage-carousel">
				<div className="container">
					<div id="getting-started">
						<p>MEDICAL DEVICES</p>
						<p>PATIENTS TESTED</p>
						<p>EXPERTS ASSESSED</p>
						<a className="border_white_btn" href="">GETTING STARTED</a>
					</div>
				</div>
				<div className="citata">
					<div className="container">
						WE PROVIDE HEALTHCARE LEADERS TRANSPARENCY ABOUT MEDICAL DEVICES.
					</div>
				</div>
			</div>
		);
	}
});
