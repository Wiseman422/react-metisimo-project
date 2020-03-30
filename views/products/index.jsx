//css ./index.less
import React from 'react';
import Layout from '../layout/index.jsx';

export default React.createClass({
	render(){
		return <Layout {...this.props}>
			<video id="sampleMovie" width="640" height="360" preload controls>
				<source src="/movies/aboutus.mov" />
			</video>
			<div id="products" className="container">
				<p>
					Medical technology innovates at a rapid pace, quickly outstripping itself to produce devices that offer improved efficacy, better results, and less invasive data collection. Integrating these new products into healthcare is crucial to improving clinical efficacy, providing patient care, and to taking advantage of technologies as they appear. Unfortunately, despite the often life-saving potential of many medical devices, clinical leaders and supply chain teams are faced with more difficulty than ever in finding, choosing, and purchasing the right devices. Metisimo solves these problems with transparent data, reviews, and expert information.
				</p>
				<h2 className="left">Consulting Services</h2>
				<p>
					At Metisimo, we provide consulting services for medical technology related challenges. Our team is well versed in the intersection of healthcare and technology and has worked on several projects in this realm. Our expertise includes but not limited to:
				</p>
					<h3>Strategy & Operations</h3>
				<ul>
					<li>Innovation and Growth Strategy</li>
					<li>Business Model Development & Sustainment</li>
					<li>Competitive Mapping & Analysis</li>
					<li>HIPAA Compliance Strategy</li>
				</ul>
				<h3>Technology Services</h3>
				<ul>
					<li>Software Development in  C# and JS</li>
					<li>Server administration for Linux and Windows</li>
					<li>Interoperability between various systems</li>
				</ul>
				<p>Metisimo launched our innovative product database to fill this gap and to providing transparent data on medical devices across the market. We provide data on tens of thousands of medical devices to help decision makers save money and reducing budget, while solving problems and improving patient care. From managing supply spend to improving clinical efficacy, we are here to help.</p>
				<h2 className="left">Business Intelligence, Data & Tools</h2>
				<p>Metisimo can help you to find, compare, and choose the right devices using our database of information and reviews. We gather information via claims reimbursement data, expert analysis, provider and patient reviews, and clinical data. Our focus on big data ensures that our platform provides information unavailable elsewhere, alongside practical advice, industry price range, and expert reviews. We also curate patient reviews, collect adverse effect information, and integrate study and trial information to allow you to make the best decision.</p>
				<p>Metisimo offers a safe, decisive method for reviewing and choosing medical devices:</p>
				<ul>
					<li>Search for products to see reviews and information</li>
					<li>Use filters and categories to browse options for ideal solutions</li>
					<li>Check basic information and device properties</li>
					<li>See product history including clinical trials, testing, etc.</li>
					<li>Filter by device type, review, rating, and more</li>
					<li>Check FDA information at a glance</li>
					<li>Get a comprehensive product rating based on consumer information, clinical testing, and expert review</li>
					<li>Check clinical information, product efficacy, adverse effects, and more.</li>
				</ul>
				<p>Purchasing medical devices should involve careful planning, product comparison, and budgeting. Metisimo provides healthcare professionals with the data they need to make informed decisions.</p>
				<p>Sign up today to get started.</p>
			</div>
		</Layout>;
	}
});
