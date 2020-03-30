//css ./index.less
import React from 'react';
import Layout from '../../layout/index.jsx';
import formatAddress from '../../../helpers/formatAddress';

var LVP = React.createClass({
	render(){
		if(this.props.value){
			return <div className="lvp">
				<label className="label">{this.props.label}</label>
				<span className="value">{this.props.value}</span>
			</div>;
		} else {
			return null;
		}
	}
});

var Events = React.createClass({ 
	render(){
		var events = (this.props.events || []).filter((item) => item.description);
		
		if(events.length == 0){
			return null;
		}

		return <div className="event-information">
			<h3>Adverse Event Information</h3>
			<ul>
				{events.map((item, index) => <li key={index}>{item.description}</li>)}
			</ul>
		</div>;
	}	
});

export default React.createClass({
	render(){ 
		var device = this.props;
		var address = formatAddress(device);
		
		return <Layout {...this.props}>
			<div id="device-detail">
				<div className="container device-header">
					<h2>{device.product_name}</h2>
					<h3>By {device.company_name}</h3>
					<div>{device.description}</div>
				</div>
				<div className="device-content">
					<div className="container">
						<div className="company-information">
							<h3>Company Information</h3>
							<div>
								<LVP label="Founded" value={false}/>
								<LVP label="Headquarter" value={false}/>
								<LVP label="Key People" value={false}/>
								<LVP label="Industry" value={false}/>
								<LVP label="Establishment Type" value={false}/>
								<LVP label="Customer Contact" value={device.customer_contact_phone}/>
								<LVP label="Customer Email" value={device.customer_contact_email}/>
								<LVP label="Customer Address" value={address}/>
								<LVP label="Company Website" value={false}/>
								<LVP label="Total # of Products" value={false}/>
							</div>
						</div>
						
						<div className="device-information">
							<h3>Device Information</h3>
							<LVP label="UDI" value={device.udi}/>
							<LVP label="Device Cost" value={device.price}/>
							<LVP label="Device Type" value={device.device_type}/>
							<LVP label="FDA Approved" value={device.fda_approved ? "YES" : "NO"}/>
							<LVP label="Prescription/ OTC" value={device.prescription ? "Prescription" : (device.otc ? "OTC" : "NA")}/>
							<LVP label="Device Type" value={device.disease_category}/>
							<LVP label="Device Classification" value={device.device_classification}/>
							<LVP label="Version" value={device.version}/>
						</div>
						<Events events={device.events}/>
					</div>
				</div>
			</div>
		</Layout>;
	}
});