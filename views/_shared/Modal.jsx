var React = require('react');
var ReactDOM = require('react-dom');
var document = global.document;

module.exports = React.createClass({
	componentDidMount : function() {
		this.node = document.getElementById('component-modal-overlay');
		if(!this.node){
			this.node = document.createElement("div");
			this.node.id = 'component-modal-overlay';
			this.node.style.display = 'none';
			this.node.addEventListener('click', this.onOverlayClick);
			document.body.appendChild(this.node);
		}
		this.renderContent();
	},
	onOverlayClick : function(e) {
		if(e.target === this.node && this.onOverlayClick){
			this.props.onOverlayClick();
		}
	},
	componentDidUpdate : function() {
		this.renderContent();
	},
	renderContent : function(){
		this.node.style.display = this.props.open ? '' : 'none';
		this.node.innerHTML = '';
		if(this.props.open) {
			ReactDOM.render(<div className="carousel-modal-content">
				{this.props.children}
			</div>, this.node);
		}
	},
	render : function(){
		return null;
	}
});
