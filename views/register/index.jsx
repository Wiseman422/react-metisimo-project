import React from 'react';
import Register from './register.jsx';
import Complete from './complete.jsx';

export default React.createClass({
	getInitialState() {
		return {
			component : Register
		};
	},
	toggleComponent() {
		this.setState({component:Complete});
	},
	render() {
		return <div id="register">
			<div className="becoming-a-member">
				<div className="">Becoming A Member</div>
				<div className="for-everyone">For Everyone</div>
			</div>
			<div className="container">
				{React.createElement(this.state.component, {
					onSubmit : this.toggleComponent
				})}
			</div>
		</div>;
	}
});