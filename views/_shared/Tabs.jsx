import React from 'react';
import _ from 'lodash';
import classnames from 'classnames';

var Tab = React.createClass({
	render(){return null;}
});

var Tabs = React.createClass({
	getInitialState() {
		return {active : 0};
	},
	onTabClick(index){
		this.setState({active : index});
	},
	getActiveClassName(className,index){
		return classnames(className, { 'active' : index === this.state.active});
	},
	render(){
		var children = _.filter(this.props.children);
		children = _.map(children,'props');

		return <div className="tab-set-container">
			<ul>
				{_.map(children, (item,index) => <li key={index} className={this.getActiveClassName('tab',index)} onClick={_.partial(this.onTabClick,index)}>{item.title}</li>)}
			</ul>
			<div className="tab-content-container">
				{_.map(children, (item,index) => <div key={index} className={this.getActiveClassName('tab-content',index)}>{item.children}</div>)}
			</div>
		</div>;
	}
});

export {Tab, Tabs};