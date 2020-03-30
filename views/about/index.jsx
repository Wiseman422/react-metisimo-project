//css ./index.less
var React = require('react');
import Layout from '../layout/index.jsx';
import Canvas from '../_shared/canvas.jsx';

export default React.createClass({
	resizeVideo() {

		var video = this.refs.video;
		video.width = global.document.body.clientWidth;
		console.info(video.width, global.document.body.clientWidth);
	},
	componentDidMount : function(){
		//this.resizeVideo();
		//global.on("resize", this.resizeVideo);
	},
	render(){
		return (<Layout {...this.props}>
		<div className="one_page_header about_page_header"></div>
		<div className="about">
			<div id="movie" className="row">
                <Canvas src='/movies/aboutus.mov' height='300px' />
			</div>
			<div className="grey_section">
				<div className="container">
					<div className="space20"></div>
					<div className="center">
						<p className="title underline underline_center">
						ABOUT US
						</p>
					</div>
					<div className="space30"></div>
					<p className="justify">
						Metisimo strives to provide industry standards and data transparency for healthcare professionals in need of medical devices. We have made it our mission to increase the availability and transparency of data surrounding healthcare technology and medical devices and we achieve this by sourcing expert assessments, data from clinical trials and papers, and patient feedback to provide a comprehensive information on every device we cover. Healthcare professionals need control over the devices they integrate into their practice, and we provide the tools to ensure that industry leaders can make informed and educated decisions.
					</p>
					<div className="space30"></div>
				</div>
			</div>
			<div className="container">
				<div className="space40"></div>
				<p className="justify">
				</p>
				<div className="space30"></div>
				<p className="justify">
					Over the past 20 years, the rate of medical technology innovations has increased at a rapid pace, leading to startling and valuable new devices for hospital and at-home use. However, this has also led to a plethora of available options, and today healthcare professionals must choose from over 40,000 different medical devices.
				</p>
        <div className="space30"></div>
        <p className="justify">
          Despite the wide availability of devices, most are poorly differentiated, with only minimal data available online, and device standards including the FDA CDRH Standards Program and the ISO 13485 are purely voluntary. As a result, healthcare leaders are left with little information with which to judge the efficacy and value of a device, leading to expensive purchases that often don't deliver. The team at Metisimo understands that in order to facilitate the widespread adoption of medical technology, healthcare professionals must have clear, transparent, and verifiable data on the devices they intend to utilize before they invest.
        </p>
        <div className="space30"></div>
        <p className="justify">
          Our vision is to see an increase in the adoption and use of healthcare technology, in hospitals, clinics, and everyday life. Medical devices can serve as tools to prolong the life, improve patient monitoring, and allow healthy consumers to monitor their fitness. We know that in order to achieve this, knowledge of these devices should be accessible and readily understood by all consumers, whether you are a provider or a patient.
        </p>
				<div className="space30"></div>
			</div>
		</div>
		</Layout>);
	}
});
