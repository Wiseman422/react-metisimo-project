//css ./products.less
import React from 'react';


export default React.createClass({
	render : function(){
		return (
			<div id="our-products">
				<div className="container">
						<h2>Our Product & Capabilities</h2>
						<div className="blocks">
							<div className="col-md-3 center">
								<img src="/images/prod1.svg" />
								<p>
									Metísimo collects verifiable information from national surveys and medical databases to make researching medical technology simple.
								</p>
								<a className="border_white_btn" href="/products">LEARN MORE</a>
							</div>
							<div className="col-md-3 center">
								<img src="/images/prod3.svg" />
								<p>
									We combine clinical data, expert assessment and patient reviews to create in-depth overviews so you can judge the clinical efficacy of every device.
								</p>
								<a className="border_white_btn" href="/products">LEARN MORE</a>
							</div>
							<div className="col-md-3 center">
								<img src="/images/prod4.svg" />
								<p>
									Our website combines powerful tools and smart data so you can quickly research and find your best-value solution. 
								</p>
								<a className="border_white_btn" href="/products">LEARN MORE</a>
							</div>
							<div className="col-md-3 center">
								<img src="/images/prod2.svg" />
								<p>
									Metísimo collaborate with researchers, medical providers and healthcare industry leaders to provide cutting edge research and data.
								</p>
								<a className="border_white_btn" href="/products">LEARN MORE</a>
							</div>
						</div>
				</div>
			</div>
		);
	}
});
