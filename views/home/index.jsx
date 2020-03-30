//css ./index.less
import React from 'react';
import Layout from '../layout/index.jsx';
//import Blog from './blog.jsx';
import Carousel from './carousel.jsx';
//import Newsletter from './newsletter.jsx';
import Products from './products.jsx';
//import Testimonials from './testimonials.jsx';
import Whatwedo from './whatwedo.jsx';


export default React.createClass({
	render(){
		return <Layout {...this.props}>
			<Carousel/>
			<Whatwedo/>
			<Products/>
		</Layout>;
	}
});