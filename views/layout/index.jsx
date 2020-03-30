//css ./index.less
import React from 'react';
import Footer from './footer.jsx';
import Header from './header.jsx';


export default React.createClass({
	render : function(){
		return (
			<div>
				<Header {...this.props}/>
				<div id='met-content'>
					{this.props.children}
				</div>
				<Footer/>
			</div>
		);
	}
});
