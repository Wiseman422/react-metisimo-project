//css ./footer.less
import React from 'react';


export default React.createClass({
	render : function(){
		return (
			<div id="met-footer">
				<div className="container">
					<div className="row">
						<div className="footer-logo">
							<a href="/"><img src="/images/footer_logo.svg" /></a>
						</div>

						<div className="footer-social">
							<ul className="social">
								<li>
									<a href="https://twitter.com/metisimo"><img src="/images/twitter.svg"/></a>
								</li>
							</ul>
						</div>

						
						<div className="footer-menu-container">
							<ul className="footer_menu">
								<li><a href="/products">Products</a></li>
								<li><a href="/device/search">Devices</a></li>
								<li><a href="/about">About</a></li>
								<li><a href="/contact">Contact Us</a></li>
							</ul>
						</div>
						
					</div>
				</div>
			</div>
		);
	}
});
/*

								<li><a href="/blog">Blog</a></li>
								<li><a href="/login">Sign In</a></li>
*/								