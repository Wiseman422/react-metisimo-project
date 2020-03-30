//css ./header.less
import React from 'react';


module.exports = React.createClass({
	getInitialState() {
		return {
			collapsed: true
		};
	},
	handleCollapseClick: function() {
		this.setState({collapsed: !this.state.collapsed});
	},
	render() {
		var user = this.props.authenticatedUserObj;

		return <header id="met-header">
			<nav className="navbar navbar-default navbar-fixed-top">
				<div className="navbar-content">
					<a href="/" className="logo">
						<img src="/images/logo.svg" className="img-responsive" />
					</a>
					<a className="menu-toggle" onClick={this.handleCollapseClick}>&#9776;</a>
					<div id="navbar" >
						<ul id="main_menu" className={"main_menu " + (this.state.collapsed ? "" : "responsive")}>
							<li><a href="/products">Products</a></li>
							<li><a href="/pricing">Pricing</a></li>
							<li><a href="/device/search">Devices</a></li>
							<li><a href="/about">About</a></li>
							<li><a href="/contact">Contact Us</a></li>
							{
								user ? <li><a href="/account">Account</a></li> : <li><a href="/login">Login</a></li>
							}
							{
								user ? <li><a href="/logout">Logout</a></li> : <li><a href="/signup" className="signupBtn">Sign Up</a></li>
							}
						</ul>
					</div>
				</div>
			</nav>
		</header>;
	}
});

/*
		<li><a href="/blog">Blog</a></li>
		<li><a href="/login">Sign In</a></li>
*/
