'use strict';

var React = require('react');
var Formsy = require('formsy-react');

module.exports = React.createClass({
	mixins: [Formsy.Mixin],
	changeValue: function (event) {
		this.setValue(event.target.value);
	},
	render: function () {
		var fromGroupClass = 'form-group row'+(this.showRequired() ? ' required ' : this.showError() ? ' error ' : ' ') + (this.state.validating ? ' validating ' : ' ') + (this.state.error ? ' error ' : ' ');
		return (
			<div className={fromGroupClass}>
				<label className='col-sm-4 text-right' htmlFor={this.name} >{this.props.label}</label>
				<div className='col-sm-8'>
					<input name={this.name} className='form-control' type='text' onChange={this.changeValue} value={this.getValue()} placeholder={this.props.placeholder} type={this.props.type} />
					<span className='error'>{this.getErrorMessage()}</span>
				</div>
				<span className='status'>
					<span className='validating glyphicon glyphicon-refresh gly-spin' aria-hidden='true'></span>
				</span>
			</div>
		);
	}
});