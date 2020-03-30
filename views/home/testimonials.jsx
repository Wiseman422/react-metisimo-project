//css ./testimonials.less
import React from 'react';


export default React.createClass({
	render : function(){
		return (
			<div id="testimonials">
				<div className="container">
					<div className="testimonial-item">
						<h2>
							Testimonials 
						</h2>
						<p className="testimonial-text big-quotes">
							"Through using Metisimo, I'm able to quickly see the medical devices to recommend to my patients saving me time while providing me comfort knowing that someone else has done a thorough research."
						</p>
						<p className="testimonial-from">
							Mr. Testimonial
						</p>
					</div>
				</div>
			</div>
		);
	}
});
