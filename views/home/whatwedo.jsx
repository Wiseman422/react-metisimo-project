//css ./whatwedo.less
import React from 'react';

export default React.createClass({
	goToSearch : function(event){
		if(event.which === 13) {
			document.location = "/device/search?search=" + this.refs.searchField.value;
		}
	},
	render : function(){
		return (
			<div id="what-do-we-do">
				<div className="container">
					<h2>How We Help</h2>
					<p>
						Sourcing a medical device means choosing between over 40,000 available options. Unfortunately, with no cogent information regarding quality, reliability, or technology, buying a medical device is often time consuming and difficult, even for medical professionals. We believe that organizations and individuals should have the power to choose the best option for their needs, and we strive to give you the information to make that possible. Metisimo offers product information together with expert reviews, client and patient feedback, and all of the technical and clinical data medical experts need to choose the right device. Sign up to get started!
					</p>
					<div className="search">
						<input placeholder="Start your search" type="text" ref="searchField" onKeyDown={this.goToSearch}/>
					</div>
				</div>
				<div className="dumbass-image"></div>
			</div>
		);
	}
});
